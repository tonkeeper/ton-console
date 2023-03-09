import { FunctionComponent } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './i18n';
import { useTranslation } from 'react-i18next';
export const App: FunctionComponent = () => {
    const { t } = useTranslation();

    return (
        <ChakraProvider>
            <div className="app">{t('app')}</div>
        </ChakraProvider>
    );
};
