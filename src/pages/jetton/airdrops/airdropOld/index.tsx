import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay, useSearchParams } from 'src/shared';
import {
    Badge,
    Box,
    BoxProps,
    Button,
    Center,
    Divider,
    Flex,
    Spinner,
    Text
} from '@chakra-ui/react';
import { airdropsStore } from 'src/features';
import { TonConnectButton } from '@tonconnect/ui-react';
import { InfoComponent } from 'src/pages/jetton/airdrops/airdrop/InfoComponent';
import { UploadComponent } from './UploadComponent';
import { DeployComponent } from './DeployComponent';
import { StatisticComponent } from './StatisticComponent';

const AirdropPage: FC<BoxProps> = () => {
    const { searchParams } = useSearchParams();
    const queryId = searchParams.get('id');
    const [loading, setLoading] = useState(false);
    const [showSwitch, setShowSwitch] = useState(true);

    const airdrop = airdropsStore.airdrop$.value;

    useEffect(() => {
        if (queryId) {
            airdropsStore.loadAirdrop(queryId!, true);
        }
        return () => {
            airdropsStore.clearAirdrop();
        };
    }, []);

    const switchClaim = async (type: 'enable' | 'disable') => {
        setLoading(true);
        await airdropsStore.switchClaim(queryId!, type, true);
        setLoading(false);
    };

    if (!airdropsStore.airdrop$.isResolved || !airdrop || !queryId) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    let description = 'Upload the file with recipients';
    let badgeText = 'PREPARATION';

    if (airdrop.status === 'need_deploy') {
        description =
            'Create and top up distribution smart contracts by clicking the Deploy button.';
    }

    if (airdrop.status === 'claim_active') {
        description = 'Airdrop is ready, you can pause claims or complete the distribution.';
        badgeText = 'CLAIM ENABLED';
    }

    if (airdrop.status === 'claim_stopped') {
        description = 'Enable users to claim by clicking the Enable Claim button.';
        badgeText = 'CLAIM DISABLED';
    }

    if (airdrop.status === 'blocked') {
        description =
            'Distribution completed. You can withdraw the accumulated profit and remaining tokens using the Withdraw button.';
        badgeText = 'FINISHED';
    }

    return (
        <Overlay display="flex" flexDirection="column" px="0">
            <Flex align="flex-start" justify="space-between" mb="5" px="6">
                <Box>
                    <Flex align="center" direction="row" gap="8px">
                        <H4 mb="1">{airdrop.name}</H4>
                        <Badge
                            textStyle="label3"
                            color="accent.blue"
                            bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                        >
                            {badgeText}
                        </Badge>
                    </Flex>
                    <Text textStyle="body2" color="text.secondary">
                        {description}
                    </Text>
                </Box>
                <TonConnectButton />
            </Flex>
            <Divider mb="3" />
            <Flex align="flex-start" direction="row" gap="16px" px="6">
                <Flex direction="column" gap="24px" minW="520px" maxW="520px">
                    <InfoComponent airdrop={airdrop} id={queryId} />
                    {airdrop.status === 'need_file' && <UploadComponent queryId={queryId} />}
                    {airdrop.status === 'need_deploy' && (
                        <DeployComponent queryId={queryId} updateType="ready" />
                    )}
                    {(airdrop.status === 'claim_active' || airdrop.status === 'claim_stopped') && (
                        <Flex direction="row" gap="16px">
                            {showSwitch && (
                                <Button
                                    isLoading={loading}
                                    onClick={() =>
                                        switchClaim(
                                            airdrop.status === 'claim_active' ? 'disable' : 'enable'
                                        )
                                    }
                                    variant={
                                        airdrop.status === 'claim_active' ? 'secondary' : undefined
                                    }
                                >
                                    {airdrop.status === 'claim_active'
                                        ? 'Disable Claim'
                                        : 'Enable Claim'}
                                </Button>
                            )}
                            <DeployComponent
                                queryId={queryId}
                                updateType="block"
                                hideEnableButton={() => setShowSwitch(false)}
                            />
                        </Flex>
                    )}
                </Flex>
                {airdrop.status !== 'need_file' && airdrop.status !== 'need_deploy' && (
                    <Flex direction="column" gap="16px">
                        <StatisticComponent />
                        {airdrop.status === 'blocked' && <DeployComponent queryId={queryId} />}
                        <Flex wrap="wrap" direction="row" gap="16px">
                            <Button
                                onClick={() => {
                                    window.open(
                                        `https://tonkeeper.github.io/airdrop-reference-dapp/?airdropId=${queryId}`,
                                        '_blank'
                                    );
                                }}
                                variant="secondary"
                            >
                                Test claim
                            </Button>
                            <Button
                                onClick={() => {
                                    window.open(
                                        'https://docs.tonconsole.com/tonconsole/jettons/airdrop',
                                        '_blank'
                                    );
                                }}
                            >
                                Documentation
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Overlay>
    );
};

export default observer(AirdropPage);
