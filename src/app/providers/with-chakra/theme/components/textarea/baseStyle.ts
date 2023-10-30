import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';
import { defineStyle } from '@chakra-ui/react';

// eslint-disable-next-line unused-imports/no-unused-vars
const { minHeight, ...typo } = textStyles.body2;

export default defineStyle({
    color: 'text.primary',
    typo
});
