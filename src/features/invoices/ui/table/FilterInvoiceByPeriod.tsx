import { FC, useState } from 'react';
import {
    BoxProps,
    Button,
    Flex,
    FocusLock,
    Input,
    Menu,
    MenuItem,
    MenuList,
    MenuListProps,
    useDisclosure,
    useMenuItem,
    useOutsideClick,
    useToast
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import {
    ArrowIcon,
    DateToDDMMYYYY,
    DDMMYYYYToDate,
    IconButton,
    MenuButtonDefault,
    mergeRefs,
    mod,
    monthsNames,
    Span,
    TickIcon,
    toDate,
    XMarkCircleIcon16
} from 'src/shared';
import { invoicesTableStore, InvoiceTableFiltration, isCustomFiltrationPeriod } from '../../models';
import { IMask, useIMask } from 'react-imask';

const useFormattedPeriod = (period: InvoiceTableFiltration['period']): string => {
    if (!period) {
        return '';
    }

    let from: Date;
    let to: Date;

    if (isCustomFiltrationPeriod(period)) {
        from = period.from;
        to = period.to;
    } else {
        const monthIndex = monthsNames.indexOf(period.month);
        from = new Date(period.year, monthIndex, 1);
        to = new Date(period.year, monthIndex + 1, 0);
    }

    const fromFormatted = toDate(from, { includeYear: true });
    const toFormatted = toDate(to, { includeYear: true });
    return `${fromFormatted} - ${toFormatted}`;
};

const currentMonthIndex = new Date().getMonth();
const currentYear = new Date().getFullYear();
const prevMonthYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;
const months = [
    {
        month: monthsNames[currentMonthIndex],
        year: currentYear
    },
    { month: monthsNames[mod(currentMonthIndex - 1, 12)], year: prevMonthYear }
];

const FilterInvoiceByPeriod: FC<BoxProps> = props => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const period = invoicesTableStore.pagination.filter.period;

    const formattedPeriod = useFormattedPeriod(period);

    return (
        <Menu
            isLazy={true}
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            placement="bottom-start"
            {...props}
        >
            <MenuButtonDefault
                px="4"
                rightIcon={
                    period ? (
                        <IconButton
                            aria-label="Clear period"
                            icon={<XMarkCircleIcon16 />}
                            onClick={e => {
                                e.stopPropagation();
                                invoicesTableStore.clearFilterByPeriod();
                                onClose();
                            }}
                        />
                    ) : (
                        <ArrowIcon />
                    )
                }
            >
                <Flex textStyle="label2" gap="2">
                    Period{!!period && ':'}{' '}
                    {!!period && <Span textStyle="body2">{formattedPeriod}</Span>}
                </Flex>
            </MenuButtonDefault>
            <MenuList zIndex={100} w="268px">
                {months.map(p => (
                    <MenuItem
                        key={p.month}
                        onClick={() => {
                            invoicesTableStore.setFilterByPeriod(p);
                        }}
                    >
                        <Span>
                            {p.month}
                            {currentYear !== prevMonthYear && ', ' + p.year}
                        </Span>
                        {!isCustomFiltrationPeriod(period) && period?.month === p.month && (
                            <TickIcon ml="auto" />
                        )}
                    </MenuItem>
                ))}
                <MenuInput onClose={onClose} />
            </MenuList>
        </Menu>
    );
};

const MenuInput: FC<
    MenuListProps & { onClose: () => void }
> = props => {
    const toast = useToast();
    const [lockFocus, setLockFocus] = useState(false);

    const { onClose, ...restProps } = props;
    const {
        role,
        ref: menuRef,
        onMouseEnter: _,
        onMouseMove: __,
        onClick: ___,
        ...rest
    } = useMenuItem(restProps);
    const { ref: maskRef, value } = useIMask({
        mask: 'D - D',
        lazy: true,
        blocks: {
            D: {
                mask: Date,
                autofix: true,
                blocks: {
                    d: {
                        mask: IMask.MaskedRange,
                        placeholderChar: 'd',
                        from: 1,
                        to: 31,
                        maxLength: 2
                    },
                    m: {
                        mask: IMask.MaskedRange,
                        placeholderChar: 'm',
                        from: 1,
                        to: 12,
                        maxLength: 2
                    },
                    Y: {
                        mask: IMask.MaskedRange,
                        placeholderChar: 'y',
                        from: 1900,
                        to: 2999,
                        maxLength: 4
                    }
                }
            }
        }
    });

    let defaultValue = '';
    const period = invoicesTableStore.pagination.filter.period;
    if (isCustomFiltrationPeriod(period)) {
        defaultValue = `${DateToDDMMYYYY(period.from)} - ${DateToDDMMYYYY(period.to)}`;
    }

    const dateIsValid = (value || '').match(/^\d{2}.\d{2}.\d{4} - \d{2}.\d{2}.\d{4}$/);
    const formIsDirty = !!value && defaultValue !== value;

    useOutsideClick({
        ref: maskRef,
        handler: () => {
            setLockFocus(false);
        }
    });

    return (
        <Flex direction="column" mt="3" role={role}>
            <Flex align="center">
                <FocusLock isDisabled={!lockFocus}>
                    <Input
                        ref={mergeRefs(menuRef, maskRef)}
                        w="208px"
                        defaultValue={defaultValue}
                        onClick={() => setLockFocus(true)}
                        placeholder="02.02.2024 - 15.02.2024"
                        {...rest}
                    />
                </FocusLock>
                {isCustomFiltrationPeriod(invoicesTableStore.pagination.filter.period) && (
                    <TickIcon ml="auto" mr="3" />
                )}
            </Flex>
            {!!value && (
                <Button
                    w="100%"
                    mt="3"
                    isDisabled={!dateIsValid || !formIsDirty}
                    onClick={() => {
                        const [fromStr, toStr] = value.split(' - ');
                        const from = DDMMYYYYToDate(fromStr);
                        const to = DDMMYYYYToDate(toStr);
                        if (from > to) {
                            return toast({
                                title: 'Error',
                                description: "'From' date must be less or equal to the 'To' date",
                                status: 'error',
                                isClosable: true
                            });
                        }

                        invoicesTableStore.setFilterByPeriod({
                            from,
                            to
                        });
                        onClose();
                    }}
                    size="sm"
                >
                    Apply
                </Button>
            )}
        </Flex>
    );
};

export default observer(FilterInvoiceByPeriod);
