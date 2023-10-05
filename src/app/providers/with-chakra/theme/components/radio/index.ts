import baseStyle from './baseStyle';
import variants from './variants';
import { defineMultiStyleConfig } from './parts';

const radioConfig = defineMultiStyleConfig({
    baseStyle,
    variants
});

export default radioConfig;
