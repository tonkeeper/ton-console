import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay, useSearchParams } from 'src/shared';
import { Box, BoxProps, Divider, Flex, Text } from '@chakra-ui/react';
import { airdropsStore } from 'src/features';

const NewAirdropPage: FC<BoxProps> = () => {
    const { searchParams } = useSearchParams();
    const queryId = searchParams.get('id');

    useEffect(() => {
        if (queryId) {
            airdropsStore.loadAirdrop(queryId!);
        }
    }, [queryId]);

    return (
        <Overlay display="flex" flexDirection="column" px="0">
            <Flex align="flex-start" justify="space-between" mb="5" px="6">
                <Box>
                    <H4 mb="1">New Sending</H4>
                    <Text textStyle="body2" color="text.secondary">
                        Connect the wallet via TON Connect version W5 only. This address will serve
                        as the admin for the mailing list.
                    </Text>
                </Box>
            </Flex>
            <Divider mb="3" />
            <Flex align="flex-start" direction="column" px="6">
                hui
            </Flex>
        </Overlay>
    );
};

export default observer(NewAirdropPage);
