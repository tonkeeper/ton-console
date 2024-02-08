import { FunctionComponent } from 'react';
import { H4, Overlay, TgChannelCardLink } from 'src/shared';
import { DashboardCardsList, DashboardChart, FeaturesList } from 'src/features';
import { Flex, Text } from '@chakra-ui/react';

const DashboardPage: FunctionComponent = () => {
    return (
        <>
            <Overlay h="fit-content" mb="4">
                <Flex align="flex-start" justify="space-between" mb="4">
                    <H4>Dashboard</H4>
                    <TgChannelCardLink size="sm" />
                </Flex>
                <DashboardCardsList mb="6" />
                <Text textStyle="label1" mb="5" color="text.primary">
                    Api requests on behalf
                </Text>
                <DashboardChart />
            </Overlay>
            <FeaturesList isContrast />
        </>
    );
};

export default DashboardPage;
