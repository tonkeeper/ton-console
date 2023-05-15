import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { Button, Divider, Text, useDisclosure } from '@chakra-ui/react';
import { CreateInvoicesProjectModal } from 'src/features';
export const RegisterProject: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Overlay>
            <H4 mb="1">Invoices</H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Description
            </Text>
            <Divider w="auto" mb="4" mx="-6" />
            <Text textStyle="label1">Instruction</Text>
            <Text textStyle="body2" mb="5" color="text.secondary">
                We need you to verify ownership of domain Please follow the steps below to prove the
                ownership. We need you to verify ownership of domain Please follow the steps below
                to prove the ownership. We need you to verify ownership of domain Please follow the
                steps below to prove the ownership. We need you to verify ownership of domain Please
                follow the steps below to prove the ownership. We need you to verify ownership of
                domain Please follow the steps below to prove the ownership. We need you to verify
                ownership of domain Please follow the steps below to prove the ownership.
            </Text>
            <Button onClick={onOpen} variant="primary">
                Create Project
            </Button>
            <CreateInvoicesProjectModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};
