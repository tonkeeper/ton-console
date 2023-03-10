const colors = {
    text: {
        primary: '#000000',
        secondary: '#7E868F',
        tertiary: '#A0A6AD',
        accent: '#2E84E5'
    },
    background: {
        page: '#F1F3F5',
        content: '#FFFFFF',
        contentTint: '#F1F3F5',
        overlay: 'rgba(0, 0, 0, 0.4)'
    },
    icon: {
        primary: '#000000',
        secondary: '#7E868F',
        tertiary: '#A0A6AD'
    },
    accent: {
        blue: '#2E84E5',
        green: '#15AD61',
        red: '#F53C36',
        orange: '#F59931'
    },
    separator: {
        common: 'rgba(0, 0, 0, 0.1)',
        inverted: 'rgba(255, 255, 255, 0.12)'
    },
    constant: {
        black: '#000000',
        white: '#FFFFFF'
    }
} as const;

export type Colors = typeof colors;
export default colors;
