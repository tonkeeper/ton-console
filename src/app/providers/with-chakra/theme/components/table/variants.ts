import { definePartsStyle } from './parts';
import textStyles from 'src/app/providers/with-chakra/theme/foundations/textStyles';

export default {
    simple: definePartsStyle({
        th: {
            ...textStyles.body2,
            '&:first-of-type': {
                pl: '4'
            },
            '&:last-child': {
                pr: '4'
            },
            py: '14px'
        },
        td: {
            '&:first-of-type': {
                pl: '4'
            },
            '&:last-child': {
                pr: '4'
            },
            py: '14px',
            borderBottom: '1px',
            borderBottomColor: 'background.contentTint',
            borderColor: 'background.contentTint'
        },
        tbody: {
            'tr:last-child td': {
                border: 'none'
            }
        }
    }),
    withBottomBorder: definePartsStyle({
        th: {
            ...textStyles.body2,
            '&:first-of-type': {
                pl: '4'
            },
            '&:last-child': {
                pr: '4'
            },
            py: '14px'
        },
        td: {
            '&:first-of-type': {
                pl: '4'
            },
            '&:last-child': {
                pr: '4'
            },
            py: '14px',
            borderBottom: '1px',
            borderBottomColor: 'background.contentTint',
            borderColor: 'background.contentTint'
        },
        tr: {
            '&:last-child td': {
                '&:first-of-type': {
                    borderBottomLeftRadius: 'sm'
                },
                '&:last-child': {
                    borderBottomRightRadius: 'sm'
                }
            }
        }
    }),
    whiteBackground: definePartsStyle({
        table: {
            borderCollapse: 'separate',
            borderSpacing: '0',
            width: '100%'
        },
        thead: {
            bg: 'white'
        },
        th: {
            ...textStyles.body2, // Убедитесь, что textStyles определены
            py: '14px',
            borderBottom: '1px',
            borderTop: '1px',
            textAlign: 'end',
            borderColor: 'background.contentTint',
            _first: {
                pl: '4',
                borderLeft: '1px',
                borderColor: 'background.contentTint',
                borderTopLeftRadius: 'sm'
            },
            _last: {
                pr: '4',
                borderRight: '1px',
                borderTop: '1px',
                borderColor: 'background.contentTint',
                borderTopRightRadius: 'sm'
            }
        },
        tbody: {
            'tr:last-child td': {
                borderBottom: '1px',
                borderBottomColor: 'background.contentTint',

                _first: {
                    borderBottomLeftRadius: 'sm'
                },

                _last: {
                    borderBottomRightRadius: 'sm'
                }
            }
        },
        td: {
            py: '14px',
            borderBottom: '1px',
            textAlign: 'end',
            borderColor: 'background.contentTint',
            _first: {
                pl: '4',
                borderLeft: '1px',
                textAlign: 'start',
                borderColor: 'background.contentTint'
            },
            _last: {
                pr: '4',
                borderRight: '1px',
                borderColor: 'background.contentTint'
            }
        }
    })
};
