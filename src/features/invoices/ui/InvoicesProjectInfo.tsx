import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { sliceAddress, Span, TooltipHoverable } from 'src/shared';
import { invoicesAppStore } from '../models';
import EditInvoicesProjectModal from './EditInvoicesProjectModal';

const InvoicesProjectInfo: FunctionComponent<ComponentProps<typeof Flex>> = props => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const app = invoicesAppStore.invoicesApp$.value;
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
                placement="top"
                host={<Span cursor="default">{sliceAddress(app.receiverAddress)}</Span>}
            >
                <Span color="text.primary">{app.receiverAddress}</Span>
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
            <EditInvoicesProjectModal isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default observer(InvoicesProjectInfo);
