import { ComponentProps, FC } from 'react';
import { Badge, Center, Spinner } from '@chakra-ui/react';
import { InvoiceStatus } from '../../models';
import { Span } from 'src/shared';

export const invoiceBadges: Record<InvoiceStatus, { color: string; label: string }> = {
    success: {
        color: 'badge.success',
        label: 'Paid'
    },
    pending: {
        color: 'badge.warning',
        label: 'Pending'
    },
    expired: {
        color: 'badge.danger',
        label: 'Expired'
    },
    cancelled: {
        color: 'badge.secondary',
        label: 'Canceled'
    }
};

export const InvoiceStatusBadge: FC<
    ComponentProps<typeof Badge> & { status: InvoiceStatus; isLoading?: boolean }
> = ({ status, isLoading, ...rest }) => {
    const badge = invoiceBadges[status];

    return (
        <Badge pos="relative" bgColor={badge.color} {...rest}>
            {isLoading && (
                <Center pos="absolute" top="0" right="0" bottom="0" left="0">
                    <Spinner color="icon.secondary" size="xs" />
                </Center>
            )}
            <Span opacity={isLoading ? 0.3 : 1}>{badge.label}</Span>
        </Badge>
    );
};
