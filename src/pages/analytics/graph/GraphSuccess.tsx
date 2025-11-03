import { FC } from 'react';
import { Button, Checkbox, Divider, Flex, Text, useClipboard } from '@chakra-ui/react';
import { ButtonLink, CopyIcon16, DoneIconCircle24, H4, InfoTooltip, Overlay } from 'src/shared';
import { AnalyticsGraphQuerySuccess, GraphAddressesList } from 'src/features';
import { useSearchParams } from 'react-router-dom';

interface GraphSuccessProps {
    query: AnalyticsGraphQuerySuccess;
}

export const GraphSuccess: FC<GraphSuccessProps> = ({ query }) => {
    const [_, setSearchParams] = useSearchParams();
    const { hasCopied, onCopy } = useClipboard(query.addresses.map(a => a.toString()).join('\n'));

    return (
        <Overlay h="100%" maxH="100%" display="flex" flexDirection="column">
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
            <Divider w="auto" mx="-6" mb="5" />
            <Flex align="center" gap="1" mb="3">
                <Checkbox
                    mb="0 !important"
                    isChecked={query.isBetweenSelectedOnly}
                    isDisabled={true}
                >
                    Only between these accounts
                </Checkbox>
                <InfoTooltip>Description</InfoTooltip>
            </Flex>
            <GraphAddressesList mb="5" addresses={query.addresses} />
            <Button
                w="fit-content"
                mb="5"
                leftIcon={<CopyIcon16 color="icon.primary" />}
                onClick={onCopy}
                variant="secondary"
            >
                {hasCopied ? 'Copied!' : 'Copy'}
            </Button>
        </Overlay>
    );
};
