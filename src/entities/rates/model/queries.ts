// React Query hooks for currency rates
// Replaces MobX ratesStore

import { useQuery } from '@tanstack/react-query';
import { CRYPTO_CURRENCY, tonapiMainnet } from 'src/shared';
import BigNumber from 'bignumber.js';

const backendCurrenciesMapping = {
    [CRYPTO_CURRENCY.TON]: {
        request: 'ton',
        response: 'TON'
    },
    [CRYPTO_CURRENCY.USDT]: {
        request: 'usdt',
        response: 'USDT'
    }
};

async function fetchRate(currency: CRYPTO_CURRENCY): Promise<BigNumber> {
    const token = backendCurrenciesMapping[currency];

    const data = await tonapiMainnet.rates.getRates({
        tokens: [token.request],
        currencies: ['usd']
    });

    const tokenRate = data.rates[token.response].prices?.USD;
    return tokenRate ? new BigNumber(tokenRate) : new BigNumber(0);
}

const RATES_KEYS = {
  ton: ['rates', CRYPTO_CURRENCY.TON],
  usdt: ['rates', CRYPTO_CURRENCY.USDT],
  all: ['rates', 'all']
};

/**
 * Fetch TON rate in USD
 */
export function useTonRateQuery() {
  return useQuery({
    queryKey: RATES_KEYS.ton,
    queryFn: () => fetchRate(CRYPTO_CURRENCY.TON),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // refetch every minute
    refetchIntervalInBackground: true // keep refetching in background
  });
}

/**
 * Fetch USDT rate in USD
 */
export function useUsdtRateQuery() {
  return useQuery({
    queryKey: RATES_KEYS.usdt,
    queryFn: () => fetchRate(CRYPTO_CURRENCY.USDT),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true
  });
}

/**
 * Fetch both rates
 */
export function useRatesQuery() {
  const tonQuery = useTonRateQuery();
  const usdtQuery = useUsdtRateQuery();

  const isLoading = tonQuery.isLoading || usdtQuery.isLoading;
  const isError = tonQuery.isError || usdtQuery.isError;
  const error = tonQuery.error || usdtQuery.error;

  const data = {
    [CRYPTO_CURRENCY.TON]: tonQuery.data || new BigNumber(0),
    [CRYPTO_CURRENCY.USDT]: usdtQuery.data || new BigNumber(0)
  };

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: () => {
      tonQuery.refetch();
      usdtQuery.refetch();
    }
  };
}

/**
 * Get rate for a specific currency
 */
export function useRateQuery(currency: CRYPTO_CURRENCY) {
  const queryKey = currency === CRYPTO_CURRENCY.TON ? RATES_KEYS.ton : RATES_KEYS.usdt;

  return useQuery({
    queryKey,
    queryFn: () => fetchRate(currency),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true
  });
}
