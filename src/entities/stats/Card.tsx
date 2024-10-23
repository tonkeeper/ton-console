import { Card, CardBody, CardHeader, Skeleton } from '@chakra-ui/react';
import { FC } from 'react';
import { H4 } from 'src/shared';

export const StatsCard: FC<{
    header: string;
    value: string;
    loading?: boolean;
}> = ({ header, value, loading = false }) => {
    return (
        <Card size="lg">
            <CardHeader textStyle="label2" pb="1" color="text.secondary">
                {header}
            </CardHeader>
            <CardBody>{loading ? <Skeleton w="100px" h="3" /> : <H4>{value}</H4>}</CardBody>
        </Card>
    );
};
