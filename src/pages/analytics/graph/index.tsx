import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';

const GraphPage: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return <Box {...props}>Graph</Box>;
};

export default GraphPage;
