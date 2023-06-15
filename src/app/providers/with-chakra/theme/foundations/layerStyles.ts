export default {
    customScrollbar: {
        '::-webkit-scrollbar': {
            width: '2'
        },
        '::-webkit-scrollbar-track': {
            background: 'transparent'
        },
        '::-webkit-scrollbar-thumb': {
            borderRadius: '10',
            background: 'scrollbar.primary',
            transition: 'background 0.15s linear'
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: 'scrollbar.hover'
        }
    },
    textEllipse: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        _after: {
            content: '""',
            display: 'block'
        }
    }
};
