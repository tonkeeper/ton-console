import { FunctionComponent } from 'react';
import { ButtonLink, H4, Overlay } from 'src/shared';
import { Button, Divider, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { CreateInvoicesProjectModal, INVOICES_LINKS, invoicesAppStore } from 'src/features';
import { observer } from 'mobx-react-lite';
const RegisterProject: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Overlay>
            <H4 mb="1">Invoices</H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Track TON payments for your business easily with Ton Console Invoices
            </Text>
            <Divider w="auto" mb="4" mx="-6" />
            <Text textStyle="label1" mb="6">
                Create Invoices Project to get started
            </Text>

            <Flex gap="3">
                <Button
                    isLoading={invoicesAppStore.createInvoicesApp.isLoading}
                    onClick={onOpen}
                    variant="primary"
                >
                    Create
                </Button>
                <ButtonLink
                    variant="secondary"
                    href={INVOICES_LINKS.BUSINESS_DESCRIPTION}
                    isExternal
                >
                    Learn more
                </ButtonLink>
            </Flex>
            <CreateInvoicesProjectModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};

export default observer(RegisterProject);
