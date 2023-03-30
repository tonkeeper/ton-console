import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { Text } from '@chakra-ui/react';
import { TonApiTiersList } from 'src/features';

const PricingPage: FunctionComponent = () => {
    return (
        <Overlay h="fit-content">
            <H4 mb="1">Pricing</H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Choose your plan for start
            </Text>
            <TonApiTiersList />
        </Overlay>
    );
};

export default PricingPage;
