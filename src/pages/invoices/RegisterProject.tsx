import { FunctionComponent } from 'react';
import { ButtonLink, FolderIcon40, H4, Overlay } from 'src/shared';
import { Button, Divider, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { CreateInvoicesProjectModal, INVOICES_LINKS, invoicesAppStore } from 'src/features';
import { observer } from 'mobx-react-lite';
const RegisterProject: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Overlay h="fit-content" pb="76px">
            <H4 mb="1">Invoices</H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Track TON payments for your business easily with Ton Console Invoices
            </Text>
            <Divider w="auto" mb="76px" mx="-6" />
            <Flex align="center" direction="column">
                <FolderIcon40 mb="4" />
                <Text mb="5" color="text.secondary">
                    Create Invoices Project to get started
                </Text>
                <Flex gap="5">
                    <ButtonLink
                        variant="secondary"
                        href={INVOICES_LINKS.BUSINESS_DESCRIPTION}
                        isExternal
                    >
                        Documentation
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
