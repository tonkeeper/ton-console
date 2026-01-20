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

interface WebhooksStatsModalProps {
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

const getWebhooksDeliveredData = (
    data: TonApiStats
): Array<{ time: number; value: number | undefined }> => {
    return data.chart
        .filter(item => item.webhooksDelivered !== undefined)
        .map(item => ({
            time: item.time,
            value: item.webhooksDelivered
        }));
};

const getWebhooksFailedData = (
    data: TonApiStats
): Array<{ time: number; value: number | undefined }> => {
    return data.chart
        .filter(item => item.webhooksFailed !== undefined)
        .map(item => ({
            time: item.time,
            value: item.webhooksFailed
        }));
};

const WebhooksStatsModal: FC<WebhooksStatsModalProps> = observer(({ isOpen, onClose }) => {
    const { isResolved, value } = tonApiStatsStore.webhooksStats$;

    if (!isResolved) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Webhooks Statistics</ModalHeader>
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
                    <ModalHeader>Webhooks Statistics</ModalHeader>
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
                <ModalHeader>Webhooks Statistics</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                    <Flex direction="column" gap={8}>
                        <Text textStyle="text.label1" mb={1} color="text.secondary" fontSize={16}>
                            Delivered Webhooks
                        </Text>
                        <Box h={250}>
                            <ResponsiveContainer height="100%">
                                <LineChart
                                    data={getWebhooksDeliveredData(value)}
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
                            Failed Webhooks
                        </Text>
                        <Box h={250}>
                            <ResponsiveContainer height="100%">
                                <LineChart
                                    data={getWebhooksFailedData(value)}
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
                                        stroke="#E55252"
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

export default WebhooksStatsModal;
