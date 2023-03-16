import { definePartsStyle } from './parts';

export default {
    md: definePartsStyle({
        dialog: {
            maxWidth: '480px'
        }
    }),
    lg: definePartsStyle({
        dialog: {
            maxWidth: '560px'
        }
    })
};
