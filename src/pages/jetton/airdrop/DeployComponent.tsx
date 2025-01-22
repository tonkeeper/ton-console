import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { fromNano } from '@ton/core';
import { Button, Center, Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import { airdropsStore } from 'src/features';
import { useTonConnectUI } from '@tonconnect/ui-react';
import {
    StatusT,
    getStatus,
    getAmount,
    getMessages,
    checkAccount,
    prettifyAmount
} from './deployUtils';
import { ADDistributorData } from 'src/shared/api/airdrop-api';
import { ConfirmationDialog } from 'src/entities';

const DeployComponentInner = (props: {
    queryId: string;
    updateType?: 'ready' | 'block';
    hideEnableButton?: () => void;
}) => {
    const airdrop = airdropsStore.airdrop$.value!;
    const initDistrubutors = airdropsStore.distributors$.value!;
    const initialStatus = getStatus(initDistrubutors);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<StatusT>(initialStatus);
    const toast = useToast();
    const [tonConnectUI] = useTonConnectUI();
    const [distributors, setDistributors] = useState<ADDistributorData[]>(initDistrubutors);
    const [amount, setAmount] = useState<{ ton: number; jetton?: number } | null>(
        getAmount(initDistrubutors, initialStatus)
    );

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchDistributors = async () => {
        await airdropsStore.loadDistributors(props.queryId).then(res => {
            setDistributors(res);
            checkStatus();
        });
    };

    useEffect(() => {
        const updateReadyStatus = status === 'ready';
        const updateWithdrawStatus =
            status === 'block' || status === 'withdraw_jetton' || status === 'withdraw_ton';

        const needUpdate =
            (props.updateType === 'ready' && updateReadyStatus) ||
            (props.updateType === 'block' && updateWithdrawStatus);

        if (needUpdate) {
            setGlobalLoading(true);
            (async () => {
                await airdropsStore.loadAirdrop(props.queryId);
            })();
        }
    }, [status, props.updateType]);

    useEffect(() => {
        (async () => {
            await fetchDistributors();
        })();
    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(async () => {
            await fetchDistributors();
        }, 2000);
        return () => resetInterval();
    }, [distributors, amount, loading]);

    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const checkStatus = () => {
        const currentStatus = getStatus(distributors);
        const needAmount = getAmount(distributors, currentStatus);
        setAmount(needAmount);
        if (status !== currentStatus) {
            setStatus(currentStatus);
            setLoading(false);
        }
    };

    const sendTransaction = async () => {
        if (status === 'waiting' || loading) {
            return;
        }
        const needAmount = getAmount(distributors, status);

        const messages = getMessages(distributors, status);

        const checkAmount = await checkAccount({
            admin: airdrop.admin,
            jetton: airdrop.jetton.address,
            needTon: needAmount.ton,
            needJetton: needAmount.jetton,
            errCb: v => {
                toast({
                    title: v.title,
                    description: v.text,
                    position: 'bottom-left',
                    duration: 5000,
                    status: 'error',
                    isClosable: true
                });
            }
        });

        if (!checkAmount) {
            return;
        }

        try {
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(new Date().getTime() / 1000 + 120),
                messages: messages
            });
            if (!!props.hideEnableButton) {
                props.hideEnableButton();
            }
            setLoading(true);
        } catch (error) {
            console.log(error);
        }
    };

    if (
        globalLoading ||
        !distributors.length ||
        status === 'waiting' ||
        !amount ||
        (airdrop.status === 'need_deploy' && status === 'ready')
    ) {
        return (
            <Center>
                <Spinner />
            </Center>
        );
    }

    if (airdrop.status === 'claim_active' || status === 'withdraw_complete') {
        return null;
    }

    if (airdrop.status === 'claim_stopped') {
        return (
            <>
                <Button
                    isLoading={loading}
                    onClick={() => setConfirmOpen(true)}
                    variant="secondary"
                >
                    Complete Airdrop
                </Button>
                <ConfirmationDialog
                    isOpen={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        setConfirmOpen(false);
                        sendTransaction();
                    }}
                    title="Complete Airdrop?"
                    description="This action cannot be canceled."
                    confirmButtonText="Complete Airdrop"
                />
            </>
        );
    }

    if (airdrop.status === 'blocked') {
        return (
            <Flex wrap="wrap" direction="row" gap="16px">
                {status === 'withdraw_jetton' && (
                    <Button isLoading={loading} onClick={sendTransaction}>
                        Withdraw {airdrop.jetton.symbol}
                    </Button>
                )}
                <Button
                    isDisabled={status === 'withdraw_jetton'}
                    isLoading={status === 'withdraw_ton' && loading}
                    onClick={sendTransaction}
                >
                    Withdraw TON
                </Button>
            </Flex>
        );
    }

    let buttonText = 'Deploy';
    let text = `You need ${prettifyAmount(fromNano(amount.ton))} TON on your wallet`;

    if (status === 'topup') {
        buttonText = 'Top Up';
        text = `You need ${prettifyAmount(fromNano(amount.ton))} TON and ${prettifyAmount(
            amount.jetton! / 10 ** parseFloat(airdrop.jetton.decimals)
        )} ${airdrop.jetton.symbol} on your wallet`;
    }

    return (
        <Flex align="center" direction="row" gap="12px">
            <Button isLoading={loading} onClick={sendTransaction}>
                {buttonText}
            </Button>
            <Text textStyle="body2" color="text.secondary">
                {text}
            </Text>
        </Flex>
    );
};

export const DeployComponent = observer(DeployComponentInner);
