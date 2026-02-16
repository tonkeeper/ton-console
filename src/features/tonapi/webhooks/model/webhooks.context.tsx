// UI state context for webhooks feature
// Manages selectedWebhook, subscriptionsPage, network

import { createContext, useContext, useState, ReactNode, FC } from 'react';
import { Network } from 'src/shared';

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
  const [selectedWebhookId, setSelectedWebhookId] = useState<number | null>(null);
  const [subscriptionsPage, setSubscriptionsPage] = useState(1);
  const [network, setNetwork] = useState<Network>(Network.MAINNET);

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
