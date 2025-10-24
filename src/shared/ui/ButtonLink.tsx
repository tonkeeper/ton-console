import { ComponentProps, FC } from 'react';
import { Button } from '@chakra-ui/react';

const externalLinkProps = {
    rel: 'noopener',
    target: '_blank'
};

const enabledLinkProps = {
    as: 'a'
} as const;

export const ButtonLink: FC<
    ComponentProps<typeof Button> & { isExternal?: boolean }
> = ({ isExternal, ...rest }) => (
    <Button
        {...(!rest.isDisabled && enabledLinkProps)}
        {...(!rest.isDisabled && isExternal && externalLinkProps)}
        {...rest}
    />
);
