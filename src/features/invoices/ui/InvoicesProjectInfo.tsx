import { FC } from 'react';
import { Box, Button, Flex, FlexProps, Text, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { sliceAddress, Span, TooltipHoverable } from 'src/shared';
import { InvoicesAppStore } from '../models';
import EditInvoicesProjectModal from './EditInvoicesProjectModal';

interface Props extends FlexProps {
    invoicesAppStore: InvoicesAppStore;
}

const InvoicesProjectInfo: FC<Props> = ({ invoicesAppStore, ...props }) => {
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
                canBeShown={true}
                placement="top"
                host={<Span cursor="default">{sliceAddress(app.receiverAddress)}</Span>}
            >
                <Span color="text.primary">{app.receiverAddress.userFriendly}</Span>
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
            <EditInvoicesProjectModal invoicesAppStore={invoicesAppStore} isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default observer(InvoicesProjectInfo);
