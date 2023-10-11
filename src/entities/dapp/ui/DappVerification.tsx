import { Box, Button, Flex, Link, Text, Tooltip, useClipboard } from '@chakra-ui/react';
import { addPath, ButtonLink, CopyPad, FileIcon16, Span } from 'src/shared';
import { ComponentProps, FunctionComponent } from 'react';
import { DAPPS_LINKS, PendingDapp } from '../model';

export const DappVerification: FunctionComponent<
    {
        pendingDapp: PendingDapp;
        onSubmit: () => unknown;
        submitLoading: boolean;
    } & ComponentProps<typeof Box>
> = ({ pendingDapp, onSubmit, submitLoading, ...rest }) => {
    const verificationFile = 'tc-verify.json';
    const verifyUrl = addPath(pendingDapp.url, 'tc-verify.json');

    const { onCopy, hasCopied } = useClipboard(verificationFile);

    return (
        <Box {...rest}>
            <Text textStyle="label1" mb="3" color="text.primary">
                Verification
            </Text>
            <Text textStyle="body2" mb="2" color="text.secondary">
                We need you to verify ownership of domain {pendingDapp.url}. Please follow the steps
                below to prove the ownership.
            </Text>
            <Text textStyle="body2" mb="2" color="text.secondary">
                Create a JSON file{' '}
                <Tooltip isOpen={hasCopied} label="Copied">
                    <Span cursor="pointer" onClick={onCopy} fontFamily="mono">
                        {verificationFile}
                    </Span>
                </Tooltip>{' '}
                copy and paste content below:
            </Text>
            <Text textStyle="label1" mb="3" color="text.primary">
                Key
            </Text>
            <CopyPad
                whiteSpace="pre-wrap"
                w="fit-content"
                mb="2"
                iconAlign="start"
                text={'{\n' + '    "payload": "' + pendingDapp.token + '"\n' + '}'}
            />
            <Text textStyle="body2" mb="2" color="text.secondary">
                Make sure the file is available at{' '}
                <Link textStyle="label2" href={verifyUrl} isExternal>
                    {verifyUrl}
                </Link>
            </Text>
            <Link
                textStyle="label2"
                alignItems="center"
                gap="2"
                display="flex"
                mb="4"
                href={DAPPS_LINKS.VALIDATION_DOCUMENTATION}
                isExternal
            >
                <FileIcon16 />
                <Span>See step-by-step guide</Span>
            </Link>
            <Flex gap="3">
                <Button isLoading={submitLoading} onClick={onSubmit}>
                    Verify
                </Button>
                <ButtonLink variant="secondary" isExternal href={DAPPS_LINKS.GET_HELP}>
                    Help
                </ButtonLink>
            </Flex>
        </Box>
    );
};
