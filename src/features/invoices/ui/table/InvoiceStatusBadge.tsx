import { ComponentProps, FunctionComponent } from 'react';
import { Badge } from '@chakra-ui/react';
import { InvoiceStatus } from '../../models';

export const invoiceBadges: Record<InvoiceStatus, { color: string; label: string }> = {
    success: {
        color: 'badge.success',
        label: 'Paid'
    },
    pending: {
        color: 'badge.warning',
        label: 'Expecting payment'
    },
    expired: {
        color: 'badge.danger',
        label: 'Expired'
    },
    cancelled: {
        color: 'badge.secondary',
        label: 'Cancelled'
    }
};

export const InvoiceStatusBadge: FunctionComponent<
    ComponentProps<typeof Badge> & { status: InvoiceStatus }
> = ({ status, ...rest }) => {
    const badge = invoiceBadges[status];

    return (
        <Badge bgColor={badge.color} {...rest}>
            {badge.label}
        </Badge>
    );
};
