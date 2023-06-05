import { definePartsStyle } from './parts';

export default definePartsStyle({
    control: {
        w: '18px',
        h: '18px',
        borderWidth: '1px',
        borderColor: 'icon.tertiary',
        transition: 'background 0.15s ease-in-out',
        _focus: {
            boxShadow: 'none'
        },
        _hover: {
            borderColor: 'icon.secondary'
        },
        _checked: {
            border: 'none',
            backgroundColor: 'icon.primary',
            '::before': {
                backgroundColor: 'transparent',
                content:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='16px' height='16px' viewBox='0 0 16 16' version='1.1'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M 11.582031 5.75 C 11.84375 6.011719 11.84375 6.433594 11.582031 6.695312 L 6.914062 11.359375 C 6.65625 11.621094 6.234375 11.621094 5.972656 11.359375 L 3.972656 9.359375 C 3.710938 9.101562 3.710938 8.679688 3.972656 8.417969 C 4.234375 8.15625 4.65625 8.15625 4.914062 8.417969 L 6.445312 9.945312 L 10.640625 5.75 C 10.898438 5.492188 11.320312 5.492188 11.582031 5.75 Z M 11.582031 5.75' fill='white'/%3E%3C/svg%3E%0A\")",
                h: 4,
                w: 4,
                pl: '1px'
            },
            _hover: {
                backgroundColor: 'icon.primary'
            }
        }
    }
});
