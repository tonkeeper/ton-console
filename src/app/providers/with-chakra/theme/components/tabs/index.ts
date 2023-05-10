import baseStyle from './baseStyle';
import { defineMultiStyleConfig } from './parts';
import sizes from './sizes';
import variants from './variants';

const tabsConfig = defineMultiStyleConfig({
    baseStyle,
    sizes,
    variants
});

export default tabsConfig;
