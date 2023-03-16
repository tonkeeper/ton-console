import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';
import { definePartsStyle } from './parts';

export default definePartsStyle({
    container: {
        mb: '4',
        color: 'text.primary',
        '> label': {
            mb: '2',
            ...textStyles.label2
        },
        ...textStyles.label2
    },
    requiredIndicator: {
        color: 'accent.red'
    }
});
