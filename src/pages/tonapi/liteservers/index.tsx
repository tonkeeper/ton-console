import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ButtonLink, ConsoleDocsIcon32, EXTERNAL_LINKS, H4, Overlay } from 'src/shared';
import { Badge, Center, Flex, Spinner, useDisclosure, Text, Link } from '@chakra-ui/react';
import { CreateLiteproxyModal, LiteproxyView } from 'src/features/tonapi/liteproxy';
import { LiteproxyStatsModal } from 'src/features/tonapi/statistics';
import { EmptyLiteservers } from './EmptyLiteservers';
import { Link as RouterLink } from 'react-router-dom';
import { liteproxysStore } from 'src/shared/stores';

const LiteserversPage: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isChartOpen, onOpen: onChartOpen, onClose: onChartClose } = useDisclosure();

    if (!liteproxysStore.liteproxyList$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    const isEmpty = liteproxysStore.liteproxyList$.value.length === 0;

    if (isEmpty) {
        return (
            <>
                <EmptyLiteservers onOpenCreate={onOpen} />;
                <CreateLiteproxyModal isOpen={isOpen} onClose={onClose} />
            </>
        );
    }

    const selectedTier = liteproxysStore.selectedTier$.value;

    return (
        <>
            <Overlay h="fit-content">
                <Flex gap={4} mb="4">
                    <Flex direction="column" gap={2}>
                        <Flex align="center" gap={4}>
                            <H4>Liteservers</H4>
                            <Badge
                                textStyle="label3"
                                color="accent.orange"
                                fontFamily="body"
                                bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                            >
                                BETA
                            </Badge>
                        </Flex>
                        <Flex align="baseline" gap={2}>
                            <Text textStyle="text.body2" color="text.secondary" fontSize={14}>
                                Your current plan:{' '}
                                {selectedTier
                                    ? `${selectedTier.name} (${selectedTier.rps} RPS)`
                                    : '...'}
                            </Text>
                            <Link as={RouterLink} ml="auto" color="accent.blue" to="./pricing">
                                Change
                                {/* <Icon as={ChevronRightIcon16} ml={2} /> */}
                            </Link>
                        </Flex>
                    </Flex>
                    <ButtonLink
                        ml="auto"
                        leftIcon={<ConsoleDocsIcon32 w="20px" h="20px" />}
                        size="md"
                        height="100%"
                        variant="secondary"
                        href={EXTERNAL_LINKS.DOCUMENTATION_LITESERVERS}
                        isExternal
                    >
                        Liteservers Doc
                    </ButtonLink>
                </Flex>
                <LiteproxyView onStatisticsClick={onChartOpen} />
            </Overlay>
            <LiteproxyStatsModal isOpen={isChartOpen} onClose={onChartClose} />
        </>
    );
};

export default observer(LiteserversPage);
