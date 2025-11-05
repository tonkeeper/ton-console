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
import { InvoiceCurrency } from '../../models';

interface Props {
    selectedCurrencies?: InvoiceCurrency[];
    onToggle: (currency: InvoiceCurrency) => void;
    onClear: () => void;
}

const FilterInvoiceByCurrency: FC<Props> = ({
    selectedCurrencies = [],
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
                    Currency{' '}
                    {!!selectedCurrencies?.length && (
                        <Center
                            textStyle="label3"
                            w="5"
                            h="5"
                            color="icon.contrast"
                            borderRadius="100%"
                            bgColor="text.primary"
                        >
                            {selectedCurrencies.length}
                        </Center>
                    )}
                </Flex>
            </MenuButtonDefault>
            <MenuList zIndex={100} w="240px">
                <Flex justify="space-between" mb="2" px="1" pt="2" color="text.secondary">
                    <Span textStyle="label2">Display only</Span>
                    {!!selectedCurrencies?.length && (
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
                {Object.values(InvoiceCurrency).map(currency => (
                    <MenuItem
                        key={currency}
                        onClick={e => {
                            e.preventDefault();
                            onToggle(currency);
                        }}
                    >
                        <Checkbox
                            icon={<TickIcon w="12px" />}
                            isChecked={selectedCurrencies?.includes(currency)}
                        >
                            {currency}
                        </Checkbox>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default FilterInvoiceByCurrency;
