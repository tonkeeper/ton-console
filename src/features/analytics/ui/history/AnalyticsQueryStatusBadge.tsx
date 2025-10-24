import { ComponentProps, FC } from 'react';
import { Badge, forwardRef } from '@chakra-ui/react';
import { AnalyticsQuery } from '../../model';
import { Span } from 'src/shared';

const queryBadges: Record<AnalyticsQuery['status'], { color: string; label: string }> = {
    success: {
        color: 'badge.success',
        label: 'Success'
    },
    executing: {
        color: 'badge.warning',
        label: 'Pending'
    },
    error: {
        color: 'badge.danger',
        label: 'Error'
    }
};

export const AnalyticsQueryStatusBadge: FC<
    ComponentProps<typeof Badge> & { status: AnalyticsQuery['status'] }
> = forwardRef(({ status, ...rest }, ref) => {
    const badge = queryBadges[status];

    return (
        <Badge ref={ref} pos="relative" bgColor={badge.color} {...rest}>
            <Span>{badge.label}</Span>
        </Badge>
    );
});
