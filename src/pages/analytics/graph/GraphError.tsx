import { FunctionComponent } from 'react';
import { Button, Checkbox, Divider, Flex, Text, useClipboard } from '@chakra-ui/react';
import { CopyIcon16, ErrorIconCircle24, H4, InfoTooltip, Overlay } from 'src/shared';
import { AnalyticsGraphQueryError, GraphAddressesList } from 'src/features';
import { useSearchParams } from 'react-router-dom';

export const GraphError: FunctionComponent<{ query: AnalyticsGraphQueryError }> = ({ query }) => {
    const [_, setSearchParams] = useSearchParams();
    const { hasCopied, onCopy } = useClipboard(query.addresses.map(a => a.userFriendly).join('\n'));
    return (
        <Overlay display="flex" flexDirection="column">
            <H4 color="accent.red" mb="2" display="flex" alignItems="center">
                <ErrorIconCircle24 mr="2" />
                Error
            </H4>
            <Text textStyle="body2" mb="4" color="text.secondary">
                {query.errorReason}
            </Text>

            <Button w="fit-content" mb="5" onClick={() => setSearchParams({})} variant="secondary">
                New Request
            </Button>

            <Divider w="auto" mb="5" mx="-6" />
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
