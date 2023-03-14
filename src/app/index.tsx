import { FunctionComponent } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './i18n';
import theme from './theme';
import { Header } from 'src/widgets/header';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
export const App: FunctionComponent = () => {
    return (
        <ChakraProvider theme={theme}>
            <TonConnectUIProvider
                manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
                uiPreferences={{
                    theme: THEME.LIGHT,
                    borderRadius: 's'
                }}
            >
                <Header />
            </TonConnectUIProvider>
        </ChakraProvider>
    );
};
