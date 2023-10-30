import { definePartsStyle } from './parts';

export default {
    md: definePartsStyle({
        container: {
            minH: '50px'
        },
        header: {
            px: '4',
            pt: '3',
            pb: '3'
        },
        body: {
            pt: '0',
            px: '4',
            pb: '3'
        },
        footer: {
            pt: '0',
            px: '4',
            pb: '3'
        }
    }),
    lg: definePartsStyle({
        container: {
            minH: '50px'
        },
        header: {
            px: '5',
            pt: '4',
            pb: '4'
        },
        body: {
            pt: '0',
            px: '5',
            pb: '4'
        },
        footer: {
            pt: '0',
            px: '5',
            pb: '4'
        }
    }),
    xl: definePartsStyle({
        container: {
            minH: '60px'
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
    })
};
