// UI state context for webhooks feature
// Manages selectedWebhook, subscriptionsPage, network (derived from URL)

import { createContext, useContext, useState, useCallback, ReactNode, FC } from 'react';
import { useSearchParams as useSearchParamsRRD } from 'react-router-dom';
import { Network } from 'src/shared';

function parseNetworkParam(value: string | null): Network {
    if (value === Network.TESTNET) return Network.TESTNET;
    return Network.MAINNET;
}

interface WebhooksContextType {
  selectedWebhookId: number | null;
  setSelectedWebhookId: (id: number | null) => void;
  subscriptionsPage: number;
  setSubscriptionsPage: (page: number) => void;
  network: Network;
  setNetwork: (network: Network) => void;
}

const WebhooksContext = createContext<WebhooksContextType | undefined>(undefined);

export const WebhooksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParamsRRD();
  const [selectedWebhookId, setSelectedWebhookId] = useState<number | null>(null);
  const [subscriptionsPage, setSubscriptionsPage] = useState(1);

  // Network derived from URL — single source of truth
  const network = parseNetworkParam(searchParams.get('network'));

  const setNetwork = useCallback((newNetwork: Network) => {
      setSearchParams(prev => {
          const next = new URLSearchParams(prev);
          if (newNetwork === Network.MAINNET) {
              next.delete('network');
          } else {
              next.set('network', newNetwork);
          }
          return next;
      }, { replace: true });
      setSubscriptionsPage(1);
  }, [setSearchParams]);

  return (
    <WebhooksContext.Provider
      value={{
        selectedWebhookId,
        setSelectedWebhookId,
        subscriptionsPage,
        setSubscriptionsPage,
        network,
        setNetwork
      }}
    >
      {children}
    </WebhooksContext.Provider>
  );
};

export function useWebhooksUI() {
  const context = useContext(WebhooksContext);
  if (context === undefined) {
    throw new Error('useWebhooksUI must be used within WebhooksProvider');
  }
  return context;
}
