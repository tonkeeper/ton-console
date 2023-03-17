import { Box, Button, Text } from '@chakra-ui/react';
import { H3 } from 'src/shared';
import { ComponentProps, FunctionComponent } from 'react';
import { useAsync } from 'react-async-hook';

interface Payment {
    amount: number;
    date: Date;
    validUntil: Date;

    plan: string;
}

function apiRequest(): Promise<Payment | null> {
    return new Promise(res => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                res({ amount: 50, date: new Date(), validUntil: new Date(), plan: 'Basic' });
            } else {
                res(null);
            }
        }, 2000);
    });
}

export const LatestPayment: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const paymentRequest = useAsync(apiRequest, []);
    return (
        <Box {...props}>
            <H3 mb={2}>Latest payment</H3>
            {paymentRequest.loading ? (
                <Text h="90px" lineHeight="90px">
                    Refreshing...
                </Text>
            ) : paymentRequest.result ? (
                <Box h="90px">
                    <Text>Plan: {paymentRequest.result?.plan}</Text>
                    <Text>Amount: {paymentRequest.result?.amount} TON</Text>
                    <Text>Payment date: {paymentRequest.result?.date.toLocaleString()}</Text>
                    <Text>
                        Valid until date: {paymentRequest.result?.validUntil.toLocaleString()}
                    </Text>
                </Box>
            ) : (
                <Text h="90px" lineHeight="90px">
                    No any payments found
                </Text>
            )}
            <Button
                mt={3}
                isLoading={paymentRequest.loading}
                loadingText="Refreshing"
                onClick={() => paymentRequest.execute()}
            >
                Refresh
            </Button>
        </Box>
    );
};
