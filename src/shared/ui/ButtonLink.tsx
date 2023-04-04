import { ComponentProps, FunctionComponent } from 'react';
import { Button } from '@chakra-ui/react';

const externalLinkProps = {
    rel: 'noopener',
    target: '_blank'
};

export const ButtonLink: FunctionComponent<
    ComponentProps<typeof Button> & { isExternal?: boolean }
> = ({ isExternal, ...rest }) => <Button as="a" {...(isExternal && externalLinkProps)} {...rest} />;
