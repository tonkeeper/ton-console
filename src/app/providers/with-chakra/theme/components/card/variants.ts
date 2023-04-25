import { definePartsStyle } from './parts';

const variants = {
    elevated: {
        container: {
            border: 'none',
            backgroundColor: 'background.contentTint',
            boxShadow: 'none'
        }
    },
    outline: definePartsStyle({
        container: {
            border: '1px',
            borderColor: 'separator.common',
            borderTopColor: 'separator.common',
            borderBottomColor: 'separator.common',
            borderRightColor: 'separator.common',
            borderLeftColor: 'separator.common',
            boxShadow: 'none'
        }
    })
};

export default variants;
