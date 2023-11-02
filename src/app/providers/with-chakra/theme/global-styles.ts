export default {
    global: {
        'html, body, #root': {
            height: '100%'
        },
        body: {
            backgroundColor: 'background.page'
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
        },
        '[data-popper-arrow] > div': {
            backgroundColor: 'background.content !important'
        }
    }
};
