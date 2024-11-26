import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';
import { defineStyle } from '@chakra-ui/react';

const { minHeight: _, ...typo } = textStyles.body2;

export default defineStyle({
    color: 'text.primary',
    typo
});
