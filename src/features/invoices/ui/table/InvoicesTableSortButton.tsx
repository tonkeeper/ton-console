import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { invoicesTableStore, InvoiceTableColumn } from '../../models';
import { SortAscIcon16, SortDescIcon16 } from 'src/shared';

const InvoicesTableColumnLabel: FunctionComponent<
    PropsWithChildren<ComponentProps<typeof Button> & { column: InvoiceTableColumn }>
> = ({ children, column, ...rest }) => {
    const shown =
        invoicesTableStore.sortDirectionTouched &&
        invoicesTableStore.pagination.sort.column === column;

    const Icon =
        shown && invoicesTableStore.pagination.sort.direction === 'asc'
            ? SortAscIcon16
            : SortDescIcon16;

    return (
        <Button
            pos="relative"
            left="-24px"
            h="fit-content"
            p="0"
            _hover={{ svg: { opacity: 1 } }}
            onClick={
                shown
                    ? invoicesTableStore.toggleSortDirection
                    : () => invoicesTableStore.setSortColumn(column)
            }
            variant="flat"
            {...rest}
            leftIcon={<Icon transition="opacity 0.15s ease-in-out" opacity={shown ? 1 : 0} />}
        >
            <Box textStyle="body2" color="text.secondary" fontFamily="mono">
                {children}
            </Box>
        </Button>
    );
};

export default observer(InvoicesTableColumnLabel);
