import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';
import { NumberedTextArea } from 'src/shared';
import { observer } from 'mobx-react-lite';

const GraphAnalyticsForm: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props}>
            <NumberedTextArea />
        </Box>
    );
};

export default observer(GraphAnalyticsForm);
