import { FC } from 'react';
import { ButtonLink, FolderIcon40, H4, Overlay } from 'src/shared';
import { Button, Divider, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { CreateInvoicesProjectModal, INVOICES_LINKS, invoicesAppStore } from 'src/features';
import { observer } from 'mobx-react-lite';

const RegisterProject: FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Overlay h="fit-content" pb="76px">
            <H4 mb="1">Track TON Payments</H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Easy TON transaction tracking
            </Text>
            <Divider w="auto" mb="76px" mx="-6" />
            <Flex align="center" direction="column">
                <FolderIcon40 mb="4" />
                <Text mb="5" color="text.secondary">
                    Create Invoice project to get started
                </Text>
                <Flex gap="5">
                    <ButtonLink
                        variant="secondary"
                        href={INVOICES_LINKS.BUSINESS_DESCRIPTION}
                        isExternal
                    >
                        Read Guide
                    </ButtonLink>
                    <Button
                        isLoading={invoicesAppStore.createInvoicesApp.isLoading}
                        onClick={onOpen}
                        variant="primary"
                    >
                        Create
                    </Button>
                </Flex>
            </Flex>
            <CreateInvoicesProjectModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};

export default observer(RegisterProject);
