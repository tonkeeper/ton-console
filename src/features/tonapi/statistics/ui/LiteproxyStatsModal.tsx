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
import { useLiteproxyStats } from 'src/features/tonapi/statistics/model/queries';

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

const LiteproxyStatsModal: FC<LiteproxyStatsModalProps> = ({ isOpen, onClose }) => {
    const { data: value, isLoading } = useLiteproxyStats();

    if (isLoading) {
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
                                <LineChart data={value.requests} margin={{ left: 0, right: 0 }}>
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
                                <LineChart data={value.connections} margin={{ left: 0, right: 0 }}>
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
};

export default LiteproxyStatsModal;
