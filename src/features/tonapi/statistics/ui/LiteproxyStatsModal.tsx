import {
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    Center,
    Spinner,
    Box
} from '@chakra-ui/react';
import { FC } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TonApiStats } from '../model/interfaces';
import { observer } from 'mobx-react-lite';
import { tonApiStatsStore } from 'src/shared/stores';

interface LiteproxyStatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const dateFormatter = (time: number) => {
    const date = new Date(time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })}`;
};

const getLiteproxyRequestsData = (
    data: TonApiStats
): Array<{ time: number; value: number | undefined }> => {
    return data.chart
        .filter(item => item.liteproxyRequests !== undefined)
        .map(item => ({
            time: item.time,
            value: item.liteproxyRequests
        }));
};

const getLiteproxyConnectionsData = (
    data: TonApiStats
): Array<{ time: number; value: number | undefined }> => {
    return data.chart
        .filter(item => item.liteproxyConnections !== undefined)
        .map(item => ({
            time: item.time,
            value: item.liteproxyConnections
        }));
};

const LiteproxyStatsModal: FC<LiteproxyStatsModalProps> = observer(({ isOpen, onClose }) => {
    const { isResolved, value } = tonApiStatsStore.liteproxyStats$;

    if (!isResolved) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Liteproxy Statistics</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center h="400px">
                            <Spinner />
                        </Center>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }

    if (!value) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Liteproxy Statistics</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center h="400px">
                            <Text color="text.secondary">No data available</Text>
                        </Center>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Liteproxy Statistics</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                    <Flex direction="column" gap={8}>
                        <Text textStyle="text.label1" mb={1} color="text.secondary" fontSize={16}>
                            Liteproxy Requests
                        </Text>
                        <Box h={250}>
                            <ResponsiveContainer height="100%">
                                <LineChart
                                    data={getLiteproxyRequestsData(value)}
                                    margin={{ left: 0, right: 0 }}
                                >
                                    <XAxis
                                        dataKey="time"
                                        type="number"
                                        domain={['dataMin', 'dataMax']}
                                        tickFormatter={dateFormatter}
                                    />
                                    <YAxis />
                                    <Tooltip labelFormatter={time => dateFormatter(Number(time))} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#2E84E5"
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>

                        <Text textStyle="text.label1" mb={1} color="text.secondary" fontSize={16}>
                            Liteproxy Connections
                        </Text>
                        <Box h={250}>
                            <ResponsiveContainer height="100%">
                                <LineChart
                                    data={getLiteproxyConnectionsData(value)}
                                    margin={{ left: 0, right: 0 }}
                                >
                                    <XAxis
                                        dataKey="time"
                                        type="number"
                                        domain={['dataMin', 'dataMax']}
                                        tickFormatter={dateFormatter}
                                    />
                                    <YAxis />
                                    <Tooltip labelFormatter={time => dateFormatter(Number(time))} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#52A02B"
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
});

export default LiteproxyStatsModal;
