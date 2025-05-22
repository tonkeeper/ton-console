import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from 'src/shared/stores';
import { useBreakpointValue } from '@chakra-ui/react';
import { ButtonLink, DocsLogo32, EXTERNAL_LINKS } from 'src/shared';

export const DocumentationButton: FC = observer(() => {
    const buttonText = useBreakpointValue({
        base: 'Docs',
        md: 'Documentation'
    });

    return userStore.isAuthorized() ? (
        <ButtonLink
            href={EXTERNAL_LINKS.DOCUMENTATION}
            isExternal
            leftIcon={<DocsLogo32 color="icon.secondary" />}
            variant="secondary"
        >
            {buttonText}
        </ButtonLink>
    ) : null;
});
