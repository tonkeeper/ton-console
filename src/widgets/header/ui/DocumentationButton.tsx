import { FC } from 'react';
import { useBreakpointValue } from '@chakra-ui/react';
import { ButtonLink, DocsLogo32, EXTERNAL_LINKS } from 'src/shared';
import { useIsAuthenticated } from 'src/entities/user/queries';

export const DocumentationButton: FC = () => {
    const isAuth = useIsAuthenticated();

    const buttonText = useBreakpointValue({
        base: 'Docs',
        md: 'Documentation'
    });

    return isAuth ? (
        <ButtonLink
            href={EXTERNAL_LINKS.DOCUMENTATION}
            isExternal
            leftIcon={<DocsLogo32 color="icon.secondary" />}
            variant="secondary"
        >
            {buttonText}
        </ButtonLink>
    ) : null;
};
