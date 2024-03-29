import colors from './colors';

export default {
    colors: {
        button: {
            primary: {
                background: '#000000',
                foreground: '#FFFFFF'
            },
            secondary: {
                background: '#F1F3F5',
                foreground: '#000000',
                backgroundHover: '#E5E7EA'
            },
            overlay: {
                background: '#FFFFFF',
                foreground: '#000000',
                backgroundHover: '#FAFAFA'
            },
            danger: {
                background: '#F53C36',
                foreground: '#FFFFFF'
            },
            flat: {
                background: 'transparent',
                foreground: '#000000'
            },
            contrast: {
                background: '#FFFFFF',
                foreground: '#000000'
            }
        },
        codeArea: {
            background: '#2E3032',
            gutterBackground: '#2E3032',
            gutterForeground: colors.text.secondary,
            stringsColor: '#F53C36',
            operatorsColor: colors.text.accent,
            footerBackground: '#232728'
        }
    }
};
