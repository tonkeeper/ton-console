import { FunctionComponent } from 'react';
import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import { ButtonLink, DoneIconCircle24, H4, Overlay } from 'src/shared';
import { AnalyticsGraphQuerySuccess } from 'src/features';
import { useSearchParams } from 'react-router-dom';

export const GraphSuccess: FunctionComponent<{ query: AnalyticsGraphQuerySuccess }> = ({
    query
}) => {
    const [_, setSearchParams] = useSearchParams();

    return (
        <Overlay display="flex" flexDirection="column">
            <H4 display="flex" alignItems="center" color="accent.green" mb="2">
                <DoneIconCircle24 mr="2" />
                Success
            </H4>
            <Text textStyle="body2" mb="4" color="text.secondary">
                Following the link you will see a visualization of the stories of the accounts you
                specified
            </Text>
            <Flex gap="4">
                <ButtonLink w="fit-content" isExternal href={query.resultUrl} mb="5">
                    Show Result
                </ButtonLink>
                <Button onClick={() => setSearchParams({})} variant="secondary">
                    New Request
                </Button>
            </Flex>
            <Divider w="auto" mb="5" mx="-6" />
        </Overlay>
    );
};
