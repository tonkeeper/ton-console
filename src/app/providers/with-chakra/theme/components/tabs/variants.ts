import { definePartsStyle } from './parts';

const variants = {
    line: definePartsStyle({
        tab: {
            color: 'text.secondary',
            borderBottom: 'none'
        },
        tablist: {
            borderBottom: 'none'
        }
    })
};

export default variants;
