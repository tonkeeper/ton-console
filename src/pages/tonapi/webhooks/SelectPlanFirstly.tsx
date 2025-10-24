import { FC } from 'react';
import { CreateIcon96, H4, Overlay } from 'src/shared';
import { Button, Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const SelectPlanFirstly: FC = () => {
    return (
        <Overlay display="flex" alignItems="center" justifyContent="center">
            <Flex align="center" direction="column" maxW="512px">
                <CreateIcon96 mb="8" />
                <H4 mb="2">Your API keys will be shown here</H4>
                <Text textStyle="body2" mb="6" color="text.secondary">
                    For start choose your TON API plan.
                </Text>
                <Link to="./pricing">
                    <Button>Choose Plan</Button>
                </Link>
            </Flex>
        </Overlay>
    );
};
