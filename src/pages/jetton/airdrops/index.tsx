import { Flex, BoxProps, Button, Center, Spinner, Text, Box } from '@chakra-ui/react';
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
                        <H4>Airdrops</H4>
                    </Flex>
                    <Text textStyle="body2" color="text.secondary">
                        A service for mass distribution of jettons
                    </Text>
                </Box>
                <Flex direction="row" gap="16px">
                    <Button
                        onClick={() => {
                            window.open(
                                'https://docs.tonconsole.com/tonconsole/jettons/airdrop',
                                '_blank'
                            );
                        }}
                        variant="secondary"
                    >
                        Documentation
                    </Button>
                    <Button as={Link} ml="auto" to={'/jetton/new-airdrop'}>
                        New Airdrop
                    </Button>
                </Flex>
            </Flex>
            <AirdropsHistoryTable />
        </Overlay>
    );
};

export default observer(AirdropsPage);
