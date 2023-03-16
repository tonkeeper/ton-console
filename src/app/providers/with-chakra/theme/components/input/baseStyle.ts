import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';
import { definePartsStyle } from './parts';

export default definePartsStyle({
    field: {
        color: 'text.primary',
        ...textStyles.body2
    }
});
