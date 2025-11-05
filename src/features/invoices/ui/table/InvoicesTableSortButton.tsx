import { FC, PropsWithChildren } from 'react';
import { Box, Button, ButtonProps } from '@chakra-ui/react';
import { InvoiceTableColumn } from '../../models';
import { SortAscIcon16, SortDescIcon16 } from 'src/shared';

interface Props extends PropsWithChildren<ButtonProps> {
    currentColumn?: InvoiceTableColumn;
    direction?: 'asc' | 'desc';
    column: InvoiceTableColumn;
    onSetColumn: (column: InvoiceTableColumn) => void;
    onToggleDirection: () => void;
    isDisabled?: boolean;
}

const InvoicesTableSortButton: FC<Props> = ({
    currentColumn,
    direction = 'desc',
    column,
    onSetColumn,
    onToggleDirection,
    isDisabled = false,
    children,
    ...rest
}) => {
    const isCurrentColumn = currentColumn === column;
    const Icon = direction === 'asc' ? SortAscIcon16 : SortDescIcon16;

    return (
        <Button
            pos="relative"
            left={isDisabled ? '0' : '-24px'}
            _hover={{ svg: { opacity: 1 } }}
            _disabled={{
                opacity: 1,
                cursor: 'default'
            }}
            isDisabled={isDisabled}
            onClick={isCurrentColumn ? onToggleDirection : () => onSetColumn(column)}
            size="fit"
            variant="flat"
            {...(!isDisabled && {
                leftIcon: (
                    <Icon transition="opacity 0.15s ease-in-out" opacity={isCurrentColumn ? 1 : 0} />
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

export default InvoicesTableSortButton;
