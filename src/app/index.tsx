import { FunctionComponent } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './i18n';
import theme from './theme';
import { Header } from 'src/widgets/header';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import {
    DashboardIcon,
    DropDownMenu,
    DropDownMenuItem,
    DropDownMenuItemExpandable,
    SettingsIcon,
    SubscriptionsIcon,
    SupportIcon,
    TonapiIcon
} from 'src/shared';
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
                <>
                    <Header />
                    <DropDownMenu w="300px">
                        <DropDownMenuItem leftIcon={<DashboardIcon />}>Dashboard</DropDownMenuItem>
                        <DropDownMenuItemExpandable leftIcon={<TonapiIcon />} content="TON API">
                            <DropDownMenuItem>Oauth</DropDownMenuItem>
                            <DropDownMenuItem>Billing</DropDownMenuItem>
                            <DropDownMenuItemExpandable content="API keys">
                                <DropDownMenuItem>&quot;Prod&quot; key</DropDownMenuItem>
                                <DropDownMenuItem>&quot;Dev&quot; key</DropDownMenuItem>
                            </DropDownMenuItemExpandable>
                        </DropDownMenuItemExpandable>
                        <DropDownMenuItem leftIcon={<SubscriptionsIcon />}>
                            Subscriptions
                        </DropDownMenuItem>
                        <DropDownMenuItem leftIcon={<SettingsIcon />}>Settings</DropDownMenuItem>
                        <DropDownMenuItem leftIcon={<SupportIcon />}>Support</DropDownMenuItem>
                    </DropDownMenu>
                </>
            </TonConnectUIProvider>
        </ChakraProvider>
    );
};
