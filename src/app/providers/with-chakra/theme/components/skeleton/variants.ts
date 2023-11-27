import { cssVar, defineStyle } from '@chakra-ui/react';

const $startColor = cssVar('skeleton-start-color');
const $endColor = cssVar('skeleton-end-color');

export default {
    dark: defineStyle({
        [$startColor.variable]: 'rgba(255, 255, 255, 0.24)', //changing startColor to red.800
        [$endColor.variable]: 'rgba(255, 255, 255, 0.08)' // changing endColor to red.600
    })
};
