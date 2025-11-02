import { FC } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    Text,
    Box
} from '@chakra-ui/react';
import MetricChart from './MetricChart';
import { ChartPoint } from '../model/queries';

export interface ChartConfig {
    title: string;
    data: ChartPoint[];
    color: string;
    limit?: number;
    limitLabel?: string;
}

interface MetricChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    charts: ChartConfig[];
}

const MetricChartModal: FC<MetricChartModalProps> = ({ isOpen, onClose, title, charts }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                    <Flex direction="column" gap={8}>
                        {charts.map((chart, index) => (
                            <Box key={index}>
                                <Text textStyle="label1" mb={4} color="text.secondary" fontSize={16}>
                                    {chart.title}
                                </Text>
                                <Box h={300}>
                                    <MetricChart
                                        data={chart.data}
                                        title={chart.title}
                                        color={chart.color}
                                        limit={chart.limit}
                                        limitLabel={chart.limitLabel}
                                        height={300}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default MetricChartModal;
