import { definePartsStyle } from './parts';

export default definePartsStyle({
    container: {
        borderRadius: 'md',
        border: '1px',
        borderColor: 'separator.common',
        borderTopColor: 'separator.common',
        borderBottomColor: 'separator.common',
        borderRightColor: 'separator.common',
        borderLeftColor: 'separator.common',
        boxShadow: 'none'
    },
    header: {
        px: '6',
        pt: '5',
        pb: '3'
    },
    body: {
        pt: '0',
        px: '6',
        pb: '4'
    },
    footer: {
        pt: '0',
        px: '6',
        pb: '6'
    }
});
