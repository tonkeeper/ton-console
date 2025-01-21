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
import { InfoComponent } from 'src/pages/jetton/airdrop/InfoComponent';
import { UploadComponent } from 'src/pages/jetton/airdrop/UploadComponent';
import { DeployComponent } from 'src/pages/jetton/airdrop/DeployComponent';

const NewAirdropPage: FC<BoxProps> = () => {
    const { searchParams } = useSearchParams();
    const queryId = searchParams.get('id');
    const [loading, setLoading] = useState(false);

    const airdrop = airdropsStore.airdrop$.value;

    useEffect(() => {
        if (queryId) {
            airdropsStore.loadAirdrop(queryId!);
        }
        return () => {
            airdropsStore.clearAirdrop();
        };
    }, []);

    const switchClaim = async (type: 'enable' | 'disable') => {
        setLoading(true);
        await airdropsStore.switchClaim(queryId!, type);
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
            'Create and top up distribution smart contracts by clicking the Deploy button';
    }

    if (airdrop.status === 'claim_active') {
        description = 'Airdrop is ready, you can pause claims or complete the distribution';
        badgeText = 'CLAIM ENABLED';
    }

    if (airdrop.status === 'claim_stopped') {
        description = 'Enable users to claim by clicking the Enable Сlaim button';
        badgeText = 'CLAIM DISABLED';
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
            <Flex direction="column" gap="24px" maxW="568px" px="6">
                <InfoComponent airdrop={airdrop} />
                {airdrop.status === 'need_file' && <UploadComponent queryId={queryId} />}
                {airdrop.status === 'need_deploy' && <DeployComponent queryId={queryId} />}
                {(airdrop.status === 'claim_active' || airdrop.status === 'claim_stopped') && (
                    <Flex direction="row">
                        <Button
                            isLoading={loading}
                            onClick={() =>
                                switchClaim(
                                    airdrop.status === 'claim_active' ? 'disable' : 'enable'
                                )
                            }
                            variant={airdrop.status === 'claim_active' ? 'secondary' : undefined}
                        >
                            {airdrop.status === 'claim_active' ? 'Disable Claim' : 'Enable Сlaim'}
                        </Button>
                    </Flex>
                )}
            </Flex>
        </Overlay>
    );
};

export default observer(NewAirdropPage);
