import { FunctionComponent } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './i18n';
import theme from './theme';
import { Header } from 'src/widgets/header';
export const App: FunctionComponent = () => {
    return (
        <ChakraProvider theme={theme}>
            <Header />
        </ChakraProvider>
    );
};
