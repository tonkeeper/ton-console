import {
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody
} from '@chakra-ui/react';
import { FC } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, BarChart } from 'recharts';
import {
    WebhooksStat,
    WebhooksStatType
} from 'src/features/tonapi/webhooks/model/interfaces/webhooks';

interface WebhookChartProps {
    data: WebhooksStat;
    metricType: WebhooksStatType;
    color: string;
}

interface WebhookChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: WebhooksStat | null;
}

const WebhookChart: FC<WebhookChartProps> = ({ data, metricType, color }) => {
    const chartData = data.result
        .filter(item => item.metric.type === metricType)
        .flatMap(item =>
            item.values.map(([timestamp, value]) => ({
                time: timestamp * 1000,
                value: parseFloat(value)
            }))
        );

    const dateFormatter = (time: number) => {
        const date = new Date(time);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis
                    dataKey="time"
                    type="number"
                    domain={['auto', 'auto']}
                    tickFormatter={dateFormatter}
                />
                <YAxis />
                <Tooltip labelFormatter={time => dateFormatter(Number(time))} />
                <Bar dataKey="value" fill={color} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const WebhookChartModal: FC<WebhookChartModalProps> = ({ isOpen, onClose, data }) => {
    if (!data) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Webhook Statistics</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text textStyle="text.label1" mb={1} color="text.secondary" fontSize={16}>
                        Failed webhook requests
                    </Text>
                    <WebhookChart data={data} metricType="failed" color="#F53C36" />
                    <Text textStyle="text.label1" mb={1} color="text.secondary" fontSize={16}>
                        Delivered webhook requests
                    </Text>
                    <WebhookChart data={data} metricType="delivered" color="#2E84E5" />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default WebhookChartModal;
