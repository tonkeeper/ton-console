import { FC } from 'react';
import { Box, Button, Flex, FlexProps, Text, useDisclosure } from '@chakra-ui/react';
import { sliceAddress, Span, TooltipHoverable } from 'src/shared';
import type { InvoicesApp, InvoicesProjectForm } from '../models';
import EditInvoicesProjectModal from './EditInvoicesProjectModal';

interface Props extends FlexProps {
    invoicesApp: {
        app: InvoicesApp | null | undefined;
        editApp: (form: InvoicesProjectForm & { id: number }) => void;
        isEditingApp: boolean;
    };
}

const InvoicesProjectInfo: FC<Props> = ({ invoicesApp, ...props }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const app = invoicesApp.app;
    if (!app) {
        return null;
    }

    return (
        <Flex textStyle="body2" color="text.secondary" {...props}>
            <Box maxW="300px">
                <Text textStyle="inherit" color="inherit" noOfLines={1}>
                    {app.name}
                </Text>
            </Box>
            <Span>&nbsp;·&nbsp;</Span>
            <TooltipHoverable
                canBeShown={true}
                placement="top"
                host={<Span cursor="default">{sliceAddress(app.receiverAddress)}</Span>}
            >
                <Span color="text.primary">{app.receiverAddress.toString()}</Span>
            </TooltipHoverable>
            <Button
                textStyle="label2"
                h="auto"
                ml="3"
                p="0"
                color="text.secondary"
                onClick={onOpen}
                variant="flat"
            >
                Edit
            </Button>
            <EditInvoicesProjectModal invoicesApp={invoicesApp} isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default InvoicesProjectInfo;
