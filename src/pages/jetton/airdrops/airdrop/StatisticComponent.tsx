import { observer } from 'mobx-react-lite';
import { Card, Center, Flex, Spinner, Text } from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { prettifyAmount } from './deployUtils';
import { fromNano } from '@ton/core';
import { AirdropFullT } from 'src/features/airdrop/model/airdrop.store';
import { ADDistributorData } from 'src/shared/api/airdrop-api';

const InfoCard = (props: { title: string; text: string }) => {
    return (
        <Card flex="1" minW="260px" bg="background.contentTint">
            <Flex direction="column" px="16px" py="12px">
                <Text textStyle="label2" color="text.secondary">
                    {props.title}
                </Text>
                <H4>{props.text}</H4>
            </Flex>
        </Card>
    );
};

const StatisticComponentInner = ({
    airdrop,
    distributors
}: {
    airdrop: AirdropFullT;
    distributors: ADDistributorData[];
}) => {
    if (!distributors.length) {
        return (
            <Center>
                <Spinner />
            </Center>
        );
    }

    const numberOfClaims = distributors.reduce((a, c) => a + (c?.completed_claims || 0), 0);
    const recipients = distributors.reduce((a, c) => a + c.recipients, 0);
    const claimedJettons = distributors.reduce(
        (a, c) => a + parseFloat(c?.claimed_amount || '0'),
        0
    );
    const remainingJettons = distributors.reduce(
        (a, c) => a + parseFloat(c?.jetton_balance || '0'),
        0
    );
    const profit = distributors.reduce(
        (a, c) => a + parseFloat(c.accumulated_commission || '0'),
        0
    );

    const unlocksCount = airdrop.vesting_parameters?.unlocks_list.length ?? 1;

    return (
        <Flex align="center" wrap="wrap" direction="row" gap="16px">
            <InfoCard
                title="Number of claims"
                text={`${prettifyAmount(numberOfClaims)} / ${prettifyAmount(
                    recipients * unlocksCount
                )}`}
            />
            <InfoCard
                title="Claimed Jettons"
                text={`${prettifyAmount(
                    claimedJettons / 10 ** parseFloat(airdrop.jetton.decimals)
                )}`}
            />
            <InfoCard
                title="Remaining Jettons"
                text={`${prettifyAmount(
                    remainingJettons / 10 ** parseFloat(airdrop.jetton.decimals)
                )} ${airdrop.jetton.symbol}`}
            />
            <InfoCard title="Profit" text={`${prettifyAmount(fromNano(profit))} TON`} />
        </Flex>
    );
};

export const StatisticComponent = observer(StatisticComponentInner);
