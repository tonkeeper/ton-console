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
        overlay: 'rgba(0, 0, 0, 0.4)',
        placeholderDark: 'rgba(0, 0, 0, 0.08)',
        placeholderLight: 'rgba(255, 255, 255, 0.08)'
    },
    icon: {
        primary: '#000000',
        secondary: '#7E868F',
        tertiary: '#A0A6AD',
        contrast: '#FFFFFF'
    },
    accent: {
        blue: '#2E84E5',
        green: '#15AD61',
        red: '#F53C36',
        orange: '#F59931'
    },
    separator: {
        common: 'rgba(131, 137, 143, 0.16)',
        inverted: 'rgba(255, 255, 255, 0.12)'
    },
    field: {
        background: '#F1F3F5',
        border: 'rgba(131, 137, 143, 0.16)',
        activeBorder: 'rgba(131, 137, 143, 0.32)',
        errorBackground: 'rgba(245, 60, 54, 0.12)',
        errorBorder: '#F53C36'
    },
    constant: {
        black: '#000000',
        white: '#FFFFFF'
    },
    scrollbar: {
        primary: '#C1C1C1',
        hover: '#7C7D7C'
    },
    badge: {
        success: 'rgba(21, 173, 97, 0.16)',
        danger: 'rgba(245, 60, 54, 0.16)',
        warning: 'rgba(245, 153, 49, 0.16)',
        secondary: '#F1F3F5'
    }
} as const;

export type Colors = typeof colors;
export default colors;
