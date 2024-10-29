import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ButtonLink, ConsoleDocsIcon32, EXTERNAL_LINKS, H4, Overlay } from 'src/shared';
import { Badge, Button, Center, Flex, Spinner, useDisclosure, Text } from '@chakra-ui/react';
import LiteproxyTable from 'src/features/tonapi/liteproxy/ui/LiteproxyTable';
import { CreateLiteproxyModal, liteproxysStore } from 'src/features/tonapi/liteproxy';
import { EmptyLiteproxy } from './EmptyLiteproxy';

const LiteproxyPage: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!liteproxysStore.liteproxyList$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    // if (!liteproxysStore.selectedTier$.value) {
    //     return <SelectPlanFirstly />;
    // }

    const isEmpty = liteproxysStore.liteproxyList$.value.length === 0;

    return (
        <>
            <Overlay h="fit-content">
                <Flex gap={4} mb="4">
                    <Flex direction="column" gap={2}>
                        <Flex align="center" gap={4}>
                            <H4>Liteproxy</H4>
                            <Badge
                                textStyle="label3"
                                color="accent.orange"
                                fontFamily="body"
                                bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                            >
                                BETA
                            </Badge>
                        </Flex>
                        <Flex>
                            {liteproxysStore.selectedTier && (
                                <Text textStyle="text.body2" color="text.secondary" fontSize={14}>
                                    Your current plan: {liteproxysStore.selectedTier.name} (
                                    {liteproxysStore.selectedTier.rps} RPS)
                                </Text>
                            )}
                        </Flex>
                        {/* <Flex>
                            <Text textStyle="text.body2" color="text.secondary" fontSize={14}>
                                For details, see{' '}
                                <Link
                                    color="accent.blue"
                                    href={EXTERNAL_LINKS.DOCUMENTATION_LITEPROXY}
                                    isExternal
                                >
                                    Liteproxy documentation
                                </Link>
                            </Text>
                        </Flex> */}
                    </Flex>
                    <ButtonLink
                        ml="auto"
                        leftIcon={<ConsoleDocsIcon32 w="20px" h="20px" />}
                        size="md"
                        height="100%"
                        variant="secondary"
                        zIndex="3"
                        href={EXTERNAL_LINKS.DOCUMENTATION_LITEPROXY}
                        isExternal
                    >
                        Liteproxy Docs
                    </ButtonLink>

                    {!isEmpty && (
                        <Button mb="4" onClick={onOpen}>
                            Create Liteproxy
                        </Button>
                    )}
                </Flex>
                {isEmpty ? <EmptyLiteproxy onOpenCreate={onOpen} /> : <LiteproxyTable />}
            </Overlay>
            <CreateLiteproxyModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(LiteproxyPage);
