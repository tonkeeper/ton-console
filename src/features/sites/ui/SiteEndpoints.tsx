import { Box, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { H4 } from 'src/shared';

const SiteEndpoints: FC = () => {
    return (
        <Box paddingY={5}>
            <H4>Endpoint</H4>
            <Text color="text.secondary" fontSize={14}>
                TODO
            </Text>
        </Box>
    );
};

export default observer(SiteEndpoints);
