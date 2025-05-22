import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { fromNano } from '@ton/core';
import { Button, Center, Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import {
    useIsConnectionRestored,
    useTonConnectModal,
    useTonConnectUI,
    useTonWallet
} from '@tonconnect/ui-react';
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
import { AirdropOldStore } from 'src/features/airdrop/model/airdrop.store';
interface DeployComponentProps {
    id: string;
    airdropStore: AirdropOldStore;
    updateType?: 'ready' | 'block';
    hideEnableButton?: () => void;
}

const DeployComponentInner = ({
    id,
    airdropStore,
    updateType,
    hideEnableButton
}: DeployComponentProps) => {
    const airdrop = airdropStore.airdrop$.value!;
    const initDistrubutors = airdropStore.distributors$.value!;
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
        await airdropStore.loadDistributors(id).then(res => {
            setDistributors(res);
            checkStatus();
        });
    };

    useEffect(() => {
        const updateReadyStatus = status === 'ready';
        const updateWithdrawStatus =
            status === 'block' || status === 'withdraw_jetton' || status === 'withdraw_ton';

        const needUpdate =
            (updateType === 'ready' && updateReadyStatus) ||
            (updateType === 'block' && updateWithdrawStatus);

        if (needUpdate) {
            setGlobalLoading(true);
            (async () => {
                await airdropStore.loadAirdrop(id);
            })();
        }
    }, [status, updateType]);

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
            needTon: needAmount?.ton || 0,
            needJetton: needAmount?.jetton || 0,
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
            if (!!hideEnableButton) {
                hideEnableButton();
            }
            setLoading(true);
        } catch (error) {
            console.log(error);
        }
    };

    if (airdrop.status === 'claim_active' || status === 'withdraw_complete') {
        return null;
    }

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
        <Flex align="center" direction="row" gap="16px">
            <Button isLoading={loading} onClick={sendTransaction}>
                {buttonText}
            </Button>
            <Text textStyle="body2" color="text.secondary">
                {text}
            </Text>
        </Flex>
    );
};

const DeployComponentConnector = (props: DeployComponentProps) => {
    const airdrop = props.airdropStore.airdrop$.value!;
    const toast = useToast();
    const connectionRestored = useIsConnectionRestored();
    const wallet = useTonWallet();
    const { open: openConnect } = useTonConnectModal();

    const showWalletError = () => {
        toast({
            title: 'Connect Admin Wallet',
            description: 'Please reconnect with admin wallet',
            position: 'bottom-left',
            duration: 5000,
            status: 'error',
            isClosable: true
        });
    };

    useEffect(() => {
        if (connectionRestored && !!wallet && wallet.account.address !== airdrop.admin) {
            showWalletError();
        }
    }, [wallet, connectionRestored]);

    if (!wallet?.account.address || wallet.account.address !== airdrop.admin) {
        return (
            <Button flex={1} alignSelf="flex-start" onClick={openConnect} variant="primary">
                Connect Admin Wallet
            </Button>
        );
    }

    return <DeployComponentInner {...props} />;
};

export const DeployComponent = observer(DeployComponentConnector);
