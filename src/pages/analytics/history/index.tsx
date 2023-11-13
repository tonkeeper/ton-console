import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import { AnalyticsHistoryTable } from 'src/features';
import { Link } from 'react-router-dom';

const HistoryPage: FunctionComponent<ComponentProps<typeof Box>> = () => {
    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="center" justify="space-between" mb="5">
                <H4>History</H4>
                <Button as={Link} to="../query" variant="secondary">
                    New Request
                </Button>
            </Flex>
            <AnalyticsHistoryTable flex="1" />
        </Overlay>
    );
};

export default HistoryPage;
