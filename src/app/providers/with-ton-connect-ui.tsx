import { ReactNode } from 'react';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import { EXTERNAL_LINKS } from 'src/shared';

export const withTonConnectUI = (component: () => ReactNode) => {
    const WithTonConnectUI = () => (
        <TonConnectUIProvider
            manifestUrl={EXTERNAL_LINKS.TONCONNECT_MANIFEST}
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
