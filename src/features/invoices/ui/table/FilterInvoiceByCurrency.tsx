import { FC } from 'react';
import {
    BoxProps,
    Button,
    Center,
    Checkbox,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    useDisclosure
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ArrowIcon, MenuButtonDefault, Span, TickIcon } from 'src/shared';
import { invoicesTableStore, InvoiceCurrency } from '../../models';

const FilterInvoiceByCurrency: FC<BoxProps> = props => {
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
                    Currency{' '}
                    {!!invoicesTableStore.pagination.filter.currency?.length && (
                        <Center
                            textStyle="label3"
                            w="5"
                            h="5"
                            color="icon.contrast"
                            borderRadius="100%"
                            bgColor="text.primary"
                        >
                            {invoicesTableStore.pagination.filter.currency.length}
                        </Center>
                    )}
                </Flex>
            </MenuButtonDefault>
            <MenuList zIndex={100} w="240px">
                <Flex justify="space-between" mb="2" px="1" pt="2" color="text.secondary">
                    <Span textStyle="label2">Display only</Span>
                    {!!invoicesTableStore.pagination.filter.currency?.length && (
                        <Button
                            onClick={() => {
                                invoicesTableStore.clearFilterByCurrency();
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
                {Object.keys(InvoiceCurrency).map(currency => (
                    <MenuItem
                        key={currency}
                        onClick={e => {
                            e.preventDefault();
                            invoicesTableStore.toggleFilterByCurrency(currency as InvoiceCurrency);
                        }}
                    >
                        <Checkbox
                            icon={<TickIcon w="12px" />}
                            id="subtractFeeFromAmount"
                            isChecked={invoicesTableStore.pagination.filter.currency?.includes(
                                currency as InvoiceCurrency
                            )}
                        >
                            {currency}
                        </Checkbox>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default observer(FilterInvoiceByCurrency);
