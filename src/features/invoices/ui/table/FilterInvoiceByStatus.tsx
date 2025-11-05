import { FC } from 'react';
import {
    Button,
    Center,
    Checkbox,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    useDisclosure
} from '@chakra-ui/react';
import { ArrowIcon, MenuButtonDefault, Span, TickIcon } from 'src/shared';
import { InvoiceStatus } from '../../models';
import { invoiceBadges } from './InvoiceStatusBadge';

interface Props {
    selectedStatuses?: InvoiceStatus[];
    onToggle: (status: InvoiceStatus) => void;
    onClear: () => void;
}

const FilterInvoiceByStatus: FC<Props> = ({
    selectedStatuses = [],
    onToggle,
    onClear,
    ...props
}) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Menu
            closeOnSelect={false}
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            placement="bottom-start"
            {...props}
        >
            <MenuButtonDefault px="4" rightIcon={<ArrowIcon />}>
                <Flex textStyle="label2" gap="2">
                    Status{' '}
                    {!!selectedStatuses?.length && (
                        <Center
                            textStyle="label3"
                            w="5"
                            h="5"
                            color="icon.contrast"
                            borderRadius="100%"
                            bgColor="text.primary"
                        >
                            {selectedStatuses.length}
                        </Center>
                    )}
                </Flex>
            </MenuButtonDefault>
            <MenuList zIndex={100} w="240px">
                <Flex justify="space-between" mb="2" px="1" pt="2" color="text.secondary">
                    <Span textStyle="label2">Display only</Span>
                    {!!selectedStatuses?.length && (
                        <Button
                            onClick={() => {
                                onClear();
                                onClose();
                            }}
                            size="fit"
                            variant="flat"
                        >
                            <Span color="text.secondary" textStyle="body2">
                                Clear All
                            </Span>
                        </Button>
                    )}
                </Flex>
                {Object.keys(InvoiceStatus).map(status => (
                    <MenuItem
                        key={status}
                        onClick={e => {
                            e.preventDefault();
                            onToggle(status as InvoiceStatus);
                        }}
                    >
                        <Checkbox
                            icon={<TickIcon w="12px" />}
                            isChecked={selectedStatuses?.includes(status as InvoiceStatus)}
                        >
                            {invoiceBadges[status as InvoiceStatus].label}
                        </Checkbox>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default FilterInvoiceByStatus;
