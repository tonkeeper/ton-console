import { extendTheme, theme as defaultTheme } from '@chakra-ui/react';
import breakpoints from './breakpoints/breakpoints';
import components from './components';
import typography from './typography';
import foundations from './foundations';
import styles from './global-styles';

const theme = extendTheme(
    {
        ...typography,
        ...foundations,
        styles,
        components
    },
    {
        config: defaultTheme.config,
        direction: defaultTheme.direction,
        transition: defaultTheme.transition,
        breakpoints,
        zIndices: defaultTheme.zIndices,
        sizes: {},
        fontSizes: {},
        fontWeights: {},
        letterSpacings: {},
        lineHeights: {}
    }
);

export default theme;
