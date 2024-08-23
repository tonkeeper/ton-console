import { FC } from 'react';
import { ButtonLink, H3, Overlay } from 'src/shared';
import { Box, Button, Flex, IconProps } from '@chakra-ui/react';

export const EmptyPage: FC<{
    Icon?: FC<IconProps>;
    title: string;
    children: React.ReactNode;
    guideButtonLink?: string;
    guideButtonText?: string;
    mainButtonAction?: () => void;
    mainButtonText?: string;
}> = ({
    Icon,
    title,
    children,
    guideButtonLink,
    guideButtonText = 'Read Guide',
    mainButtonAction,
    mainButtonText = 'Contact Us'
}) => {
    return (
        <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
            {Icon && <Icon boxSize="40px" mb="5" />}
            <H3 mb="4">{title}</H3>
            <Box textStyle="body2" maxW="392px" mb="9" color="text.secondary">
                {children}
            </Box>

            <Flex gap="5">
                {guideButtonLink && (
                    <ButtonLink size="md" variant="secondary" isExternal href={guideButtonLink}>
                        {guideButtonText}
                    </ButtonLink>
                )}
                {mainButtonAction && (
                    <Button onClick={mainButtonAction} variant="primary">
                        {mainButtonText}
                    </Button>
                )}
            </Flex>
        </Overlay>
    );
};
