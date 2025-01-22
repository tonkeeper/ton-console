import { Flex, BoxProps, Button, Center, Spinner, Text, Box, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { H4, Overlay } from 'src/shared';
import { airdropsStore } from 'src/features';
import { EmptyAirdrops } from './EmptyAirdrops.tsx';
import AirdropsHistoryTable from 'src/features/airdrop/ui/AirdropsHistoryTable';

const AirdropsPage: FC<BoxProps> = () => {
    if (!airdropsStore.airdrops$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }
    if (!airdropsStore.airdrops$.value.length) {
        return <EmptyAirdrops />;
    }
    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" gap="3" mb="5">
                <Box>
                    <Flex align="center" direction="row" gap="8px">
                        <H4>Airdrop</H4>
                        <Badge
                            textStyle="label3"
                            color="accent.red"
                            bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                        >
                            MAINNET The service is in the testing phase. Do not use for production
                            airdrops!
                        </Badge>
                    </Flex>
                    <Text textStyle="body2" color="text.secondary">
                        A service for mass distribution of jettons
                    </Text>
                </Box>
                <Button as={Link} ml="auto" to={'/jetton/new-airdrop'}>
                    New Airdrop
                </Button>
            </Flex>
            <AirdropsHistoryTable />
        </Overlay>
    );
};

export default observer(AirdropsPage);
