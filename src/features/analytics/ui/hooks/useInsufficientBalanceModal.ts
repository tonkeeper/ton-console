import { useState, useCallback } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { SendQueryToStatsError } from 'src/shared/api/console';
import { useBalanceQuery } from 'src/features/balance/model/queries';
import { InsufficientBalanceState } from 'src/entities/balance/ui/InsufficientBalanceModal';

interface UseInsufficientBalanceModalReturn {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    error: InsufficientBalanceState | undefined;
    handlePaymentRequiredError: (error: SendQueryToStatsError) => void;
}

/**
 * Hook to handle 402 Payment Required errors with InsufficientBalanceModal
 * Automatically clears error state on close
 */
export function useInsufficientBalanceModal(): UseInsufficientBalanceModalReturn {
    const { isOpen, onOpen, onClose: onCloseBase } = useDisclosure();
    const [error, setError] = useState<InsufficientBalanceState | undefined>(undefined);
    const { data: balance } = useBalanceQuery();

    const onClose = useCallback(() => {
        setError(undefined);
        onCloseBase();
    }, [onCloseBase]);

    const handlePaymentRequiredError = useCallback(
        (err: SendQueryToStatsError) => {
            if ('need_usd' in err) {
                setError({
                    message: err.error || 'Insufficient balance to execute this query',
                    needUsd: err.need_usd,
                    currentBalance: balance?.usdt.amount ?? 0n
                });
                onOpen();
                return;
            }

            throw err;
        },
        [onOpen, balance]
    );

    return {
        isOpen,
        onOpen,
        onClose,
        error,
        handlePaymentRequiredError
    };
}
