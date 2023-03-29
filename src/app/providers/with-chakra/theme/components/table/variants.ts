import { definePartsStyle } from './parts';
import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';

export default {
    simple: definePartsStyle({
        th: {
            ...textStyles.body2,
            '&:first-child': {
                pl: '4'
            },
            '&:last-child': {
                pr: '4'
            },
            py: '14px'
        },
        td: {
            '&:first-child': {
                pl: '4'
            },
            '&:last-child': {
                pr: '4'
            },
            py: '14px'
        }
    })
};
