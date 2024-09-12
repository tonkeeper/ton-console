import { ReactNode } from 'react';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';

export const withTonConnectUI = (component: () => ReactNode) => {
    const WithTonConnectUI = () => (
        <TonConnectUIProvider
            manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
            uiPreferences={{
                theme: THEME.LIGHT,
                borderRadius: 's'
            }}
        >
            {component()}
        </TonConnectUIProvider>
    );

    return WithTonConnectUI;
};
