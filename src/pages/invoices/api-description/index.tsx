import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

const ApiDescriptionPage: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return <Box {...props}>ApiDescriptionPage</Box>;
};

export default observer(ApiDescriptionPage);
