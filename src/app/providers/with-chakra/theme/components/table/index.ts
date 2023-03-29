import baseStyle from './baseStyle';
import variants from './variants';
import { defineMultiStyleConfig } from './parts';

const tableConfig = defineMultiStyleConfig({
    baseStyle,
    variants
});

export default tableConfig;
