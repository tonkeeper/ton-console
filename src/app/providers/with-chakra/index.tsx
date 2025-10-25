 

import { ReactNode } from 'react';
import theme from './theme';
import { ChakraProvider } from '@chakra-ui/react';

export const withChakra = (component: () => ReactNode) => () =>
    <ChakraProvider theme={theme}>{component()}</ChakraProvider>;
