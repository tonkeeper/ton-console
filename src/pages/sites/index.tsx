import { Button, Flex, useDisclosure, BoxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { EmptyPage } from 'src/entities';
import { SiteList } from 'src/features';
import { sitesStore } from 'src/features/sites/model';
import SiteAddModal from 'src/features/sites/ui/SiteAddModal';
import { H4, Overlay, PlusIcon16 } from 'src/shared';
import { GloubeIcon40 } from 'src/shared/ui/icons/GloubeIcon40';

const SitesPage: FC<BoxProps> = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const isSitesEmpty = sitesStore.sites$.value.length === 0;

    // TODO add loader for sites

    if (isSitesEmpty) {
        return (
            <>
                <EmptyPage
                    title="TON Sites"
                    description="Your Domains and endpoints will be shown here. We help you connect to any resource using the TON DNS."
                    Icon={GloubeIcon40}
                    // guideButtonLink="https://ton.dev"
                    mainButtonAction={onOpen}
                    mainButtonText="Add domain"
                />
                <SiteAddModal isOpen={isOpen} onClose={onClose} />
            </>
        );
    }

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>Domains</H4>
                <Button gap="10px" onClick={onOpen} variant="secondary">
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
