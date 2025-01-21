import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
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
import { fromNano } from '@ton/core';

const DeployComponentInner = (props: { queryId: string }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<StatusT>('waiting');
    const toast = useToast();
    const [tonConnectUI] = useTonConnectUI();
    const [distributors, setDistributors] = useState<ADDistributorData[]>([]);
    const [amount, setAmount] = useState<{ ton: number; jetton?: number } | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const airdrop = airdropsStore.airdrop$.value!;

    const fetchDistributors = async () => {
        const res = await airdropsStore.loadDistributors(props.queryId);
        setDistributors(res);
        checkStatus();
    };

    useEffect(() => {
        (async () => {
            await fetchDistributors();
        })();
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
            setLoading(true);
        } catch (error) {
            console.log(error);
        }
    };

    if (!distributors.length || status === 'waiting' || !amount) {
        return (
            <Center>
                <Spinner />
            </Center>
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
