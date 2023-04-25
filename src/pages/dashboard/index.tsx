import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { DashboardCardsList, DashboardChart } from 'src/features';
import { Text } from '@chakra-ui/react';

const DashboardPage: FunctionComponent = () => {
    return (
        <Overlay>
            <H4 mb="5">Dashboard</H4>
            <DashboardCardsList mb="6" />
            <Text textStyle="label1" mb="5" color="text.primary">
                Api requests on behalf
            </Text>
            <DashboardChart />
        </Overlay>
    );
};

export default DashboardPage;
