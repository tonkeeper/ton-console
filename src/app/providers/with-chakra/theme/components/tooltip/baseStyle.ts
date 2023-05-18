import { defineStyle } from '@chakra-ui/react';
import textStyles from '../../foundations/textStyles';

export default defineStyle({
    border: 'none',
    borderRadius: 'md',
    whiteSpace: 'normal',
    background: 'background.content',
    color: 'text.primary',
    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04)) drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.12))',
    ...textStyles.label2
});
