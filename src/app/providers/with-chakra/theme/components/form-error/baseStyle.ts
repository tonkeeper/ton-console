import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';
import { definePartsStyle } from './parts';

export default definePartsStyle({
    text: {
        mt: '1',
        position: 'absolute',
        color: 'accent.red',
        ...textStyles.label3
    }
});
