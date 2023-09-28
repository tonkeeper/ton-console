import { definePartsStyle } from './parts';

const variants = {
    line: definePartsStyle({
        tab: {
            color: 'text.secondary',
            borderBottom: 'none'
        },
        tablist: {
            pb: '1px',
            borderBottomWidth: '1px',
            borderBottomColor: 'separator.common'
        }
    })
};

export default variants;
