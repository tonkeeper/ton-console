import { FunctionComponent } from 'react';
import { Button, ChakraProvider } from '@chakra-ui/react';
import './i18n';
import { useTranslation } from 'react-i18next';
import theme from './theme';
export const App: FunctionComponent = () => {
    const { t } = useTranslation();

    return (
        <ChakraProvider theme={theme}>
            <div className="app">{t('app')}</div>
            <Button ml={3}>{t('app')}</Button>
        </ChakraProvider>
    );
};
