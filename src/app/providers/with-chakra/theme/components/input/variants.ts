import { definePartsStyle } from './parts';

export default {
    primary: definePartsStyle({
        field: {
            backgroundColor: 'field.background',
            border: '1px',
            borderColor: 'field.border',
            _placeholder: {
                color: 'text.secondary'
            },
            _focus: {
                borderColor: 'field.activeBorder'
            },
            _invalid: {
                backgroundColor: 'field.errorBackground',
                borderColor: 'field.errorBorder'
            }
        }
    })
};
