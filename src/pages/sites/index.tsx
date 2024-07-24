import { Button, Flex, BoxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { EmptyPage } from 'src/entities';
import { H4, Overlay, PlusIcon16 } from 'src/shared';
import { GloubeIcon40 } from 'src/shared/ui/icons/GloubeIcon40';

const SitesPage: FC<BoxProps> = () => {
    // TODO add loader for sites

    if (true) {
        return (
            <>
                <EmptyPage
                    title="TON Sites"
                    description="Your Domains and endpoints will be shown here. We help you connect to any resource using the TON DNS."
                    Icon={GloubeIcon40}
                    // guideButtonLink="https://ton.dev"
                    mainButtonAction={() => {}}
                    mainButtonText="Add domain"
                />
            </>
        );
    }

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>Domains</H4>
                <Button gap="10px" onClick={() => {}} variant="secondary">
                    <PlusIcon16 />
                    Add domain
                </Button>
            </Flex>
        </Overlay>
    );
};

export default observer(SitesPage);
