import { definePartsStyle } from './parts';
import Fonts from '../../typography/fonts';
import textStyles from '../../foundations/textStyles';

export default definePartsStyle({
    thead: {
        backgroundColor: 'background.contentTint'
    },
    th: {
        fontFamily: Fonts.mono,
        color: 'text.secondary',
        letterSpacing: 'unset',
        textTransform: 'unset',
        ...textStyles.body2
    },
    td: {
        borderTopColor: 'background.contentTint',
        borderBottomColor: 'background.contentTint',
        fontFamily: Fonts.mono,
        ...textStyles.body2,
        color: 'text.primary'
    }
});
