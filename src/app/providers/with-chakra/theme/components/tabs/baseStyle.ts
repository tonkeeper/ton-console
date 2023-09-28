import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';
import { definePartsStyle } from './parts';

export default definePartsStyle({
    tab: {
        ...textStyles.label2,
        position: 'relative',
        _after: {
            content: '""',
            display: 'block',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            backgroundColor: 'icon.primary',
            transform: 'translateZ(0) scale(0)',
            transformOrigin: 'center',
            opacity: '1',
            transition: 'opacity 300ms, transform 300ms'
        },
        _selected: {
            _after: {
                transform: 'translateZ(0) scale(1)'
            },
            color: 'text.primary'
        },
        _active: {
            bg: 'transparent'
        }
    },
    tabpanel: {
        px: '0',
        pb: '0',
        pt: '4'
    }
});
