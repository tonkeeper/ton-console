import { Button, Flex, useDisclosure, BoxProps, Spinner, Badge, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { SiteList, SitesEmptyState } from 'src/features';
import { sitesStore } from 'src/features';
import { SiteAddModal } from 'src/features';
import { H4, InfoIcon16, Overlay, PlusIcon16 } from 'src/shared';

const SitesPage: FC<BoxProps> = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const isSitesEmpty = sitesStore.sites$.value.length === 0;

    if (isSitesEmpty && sitesStore.sites$.isLoading) {
        return (
            <Overlay display="flex" justifyContent="center" alignItems="center">
                <Spinner />
            </Overlay>
        );
    }

    if (sitesStore.sites$.value.length === 0) {
        return (
            <>
                <SitesEmptyState onAddDomain={onOpen} />
                <SiteAddModal isOpen={isOpen} onClose={onClose} />
            </>
        );
    }

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="center" mb="5">
                <H4>Domains</H4>

                <Badge
                    textStyle="label3"
                    ml="2"
                    color="accent.orange"
                    fontFamily="body"
                    bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                >
                    BETA
                </Badge>

                <Text
                    textStyle="body2"
                    alignItems="center"
                    gap="1"
                    display="flex"
                    ml="auto"
                    color="text.secondary"
                >
                    <InfoIcon16 />
                    We provide 10GB of traffic for free
                </Text>
                <Button gap="10px" ml="4" onClick={onOpen} variant="secondary">
                    <PlusIcon16 />
                    Add domain
                </Button>
            </Flex>
            <SiteAddModal isOpen={isOpen} onClose={onClose} />
            <SiteList />
        </Overlay>
    );
};

export default observer(SitesPage);
