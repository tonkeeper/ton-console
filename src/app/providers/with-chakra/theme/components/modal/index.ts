import baseStyle from './baseStyle';
import defaultProps from './defaultProps';
import { defineMultiStyleConfig } from './parts';
import sizes from './sizes';

const modalConfig = defineMultiStyleConfig({
    baseStyle,
    defaultProps,
    sizes
});

export default modalConfig;
