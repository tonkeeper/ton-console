import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { DashboardCardsList } from 'src/features';
import { Text } from '@chakra-ui/react';

const DashboardPage: FunctionComponent = () => {
    return (
        <Overlay>
            <H4 mb="5">Dashboard</H4>
            <DashboardCardsList mb="6" />
            <Text textStyle="label1" color="text.primary">
                Api requests on behalf
            </Text>
        </Overlay>
    );
};

export default DashboardPage;
