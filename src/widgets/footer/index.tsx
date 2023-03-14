import { ChangeEvent, FunctionComponent, useCallback } from 'react';
import { Box, Flex, Link, Text, chakra } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Select = chakra('select', {
    baseStyle: {
        textStyle: 'body2',
        w: 'fit-content',
        h: 'fit-content',
        p: '0',
        color: 'text.secondary',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        backgroundColor: 'transparent',
        WebkitAppearance: 'none',
        MozAppearance: 'none'
    }
});

export const Footer: FunctionComponent = () => {
    const { i18n } = useTranslation();
    const onLanguageChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            const value = event.target.value;
            if (value !== 'default') {
                i18n.changeLanguage(value);
            }
        },
        [i18n]
    );

    return (
        <Box as="footer" ml="1">
            <Flex wrap="wrap" gap="4" rowGap="1.5" mb="1.5">
                <Select value="default" onChange={onLanguageChange}>
                    <option value="default">Language</option>
                    <option value="en">en</option>
                    <option value="ru">ru</option>
                </Select>
                <Link href="https://tonkeeper.com/" isExternal>
                    Terms
                </Link>
                <Link href="https://tonkeeper.com/" isExternal>
                    Report Issue
                </Link>
            </Flex>
            <Text textStyle="body2" color="text.secondary">
                © 2023 TON Console
            </Text>
        </Box>
    );
};
