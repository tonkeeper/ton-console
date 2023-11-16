export default {
    global: {
        'html, body, #root': {
            height: '100%'
        },
        body: {
            backgroundColor: 'background.page',
            WebkitTouchCallout: 'none'
        },
        img: {
            WebkitUserSelect: 'none',
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            OUserSelect: 'none',
            userSelect: 'none'
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
