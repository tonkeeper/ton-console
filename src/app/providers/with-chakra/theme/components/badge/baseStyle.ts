import { defineStyle } from '@chakra-ui/react';
import textStyles from '../../foundations/textStyles';

export default defineStyle({
    ...textStyles.body2,
    textTransform: 'unset',
    backgroundColor: 'background.contentTint',
    fontFamily: 'mono',
    px: 2,
    py: 0.5
});
