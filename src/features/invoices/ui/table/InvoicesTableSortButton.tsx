import { FC, PropsWithChildren } from 'react';
import { Box, Button, ButtonProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { invoicesTableStore, InvoiceTableColumn } from '../../models';
import { SortAscIcon16, SortDescIcon16 } from 'src/shared';

const InvoicesTableColumnLabel: FC<
    PropsWithChildren<ButtonProps & { column: InvoiceTableColumn }>
> = ({ children, column, ...rest }) => {
    const disabled =
        !invoicesTableStore.invoices$.value.length && !invoicesTableStore.invoices$.isLoading;

    const defaultShown =
        invoicesTableStore.sortDirectionTouched &&
        invoicesTableStore.pagination.sort.column === column;

    const Icon =
        defaultShown && invoicesTableStore.pagination.sort.direction === 'asc'
            ? SortAscIcon16
            : SortDescIcon16;

    return (
        <Button
            pos="relative"
            left={disabled ? '0' : '-24px'}
            _hover={{ svg: { opacity: 1 } }}
            _disabled={{
                opacity: 1,
                cursor: 'default'
            }}
            isDisabled={disabled}
            onClick={
                defaultShown
                    ? invoicesTableStore.toggleSortDirection
                    : () => invoicesTableStore.setSortColumn(column)
            }
            size="fit"
            variant="flat"
            {...(!disabled && {
                leftIcon: (
                    <Icon transition="opacity 0.15s ease-in-out" opacity={defaultShown ? 1 : 0} />
                )
            })}
            {...rest}
        >
            <Box textStyle="body2" color="text.secondary" fontFamily="mono">
                {children}
            </Box>
        </Button>
    );
};

export default observer(InvoicesTableColumnLabel);
