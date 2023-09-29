import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';

const HistoryPage: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return <Box {...props}>History</Box>;
};

export default HistoryPage;
