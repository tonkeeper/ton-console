import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay, useSearchParams } from 'src/shared';
import { Box, BoxProps, Center, Divider, Flex, Spinner, Text } from '@chakra-ui/react';
import { airdropsStore } from 'src/features';
import { TonConnectButton } from '@tonconnect/ui-react';
import { InfoComponent } from 'src/pages/jetton/airdrop/InfoComponent';
import { UploadComponent } from 'src/pages/jetton/airdrop/UploadComponent';

const NewAirdropPage: FC<BoxProps> = () => {
    const { searchParams } = useSearchParams();
    const queryId = searchParams.get('id');

    const airdrop = airdropsStore.airdrop$.value;

    useEffect(() => {
        if (queryId) {
            airdropsStore.loadAirdrop(queryId!);
        }
    }, [queryId]);

    if (!airdropsStore.airdrop$.isResolved || !airdrop || !queryId) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    return (
        <Overlay display="flex" flexDirection="column" px="0">
            <Flex align="flex-start" justify="space-between" mb="5" px="6">
                <Box>
                    <H4 mb="1">{airdrop.name}</H4>
                    <Text textStyle="body2" color="text.secondary">
                        Upload the file with recipients
                    </Text>
                </Box>
                <TonConnectButton />
            </Flex>
            <Divider mb="3" />
            <Flex align="flex-start" direction="column" gap="24px" px="6">
                <InfoComponent airdrop={airdrop} />
                {!airdrop.processed && <UploadComponent queryId={queryId} />}
            </Flex>
        </Overlay>
    );
};

export default observer(NewAirdropPage);
