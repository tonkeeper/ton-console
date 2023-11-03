export default {
    global: {
        'html, body, #root': {
            height: '100%'
        },
        body: {
            backgroundColor: 'background.page',
            '-webkit-touch-callout': 'none'
        },
        img: {
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select:': 'none',
            '-o-user-select': 'none',
            'user-select': 'none'
        },
        '[data-tc-dropdown-button="true"]': {
            backgroundColor: 'background.contentTint',
            boxShadow: 'none',
            _hover: {
                transform: 'none'
            },
            _active: {
                transform: 'none'
            }
        }
    }
};
