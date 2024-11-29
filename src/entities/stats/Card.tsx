import { BoxProps, Card, CardBody, CardHeader, Skeleton } from '@chakra-ui/react';
import { FC } from 'react';
import { H4 } from 'src/shared';

export const StatsCard: FC<
    BoxProps & {
        header: string;
        value: string | number;
        loading?: boolean;
        onClick?: () => void;
    }
> = ({ header, value, loading = false, onClick, ...props }) => {
    return (
        <Card
            as={onClick ? 'button' : 'div'}
            _hover={onClick ? { transform: 'scale(1.01)' } : undefined}
            cursor={onClick ? 'pointer' : 'default'}
            onClick={onClick}
            {...props}
        >
            <CardHeader textStyle="label2" pb="1" color="text.secondary">
                {header}
            </CardHeader>
            <CardBody>{loading ? <Skeleton w="100px" h="3" /> : <H4>{value}</H4>}</CardBody>
        </Card>
    );
};
