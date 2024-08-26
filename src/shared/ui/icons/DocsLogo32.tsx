import { Icon, IconProps } from '@chakra-ui/react';
import { FC } from 'react';

export const DocsLogo32: FC<IconProps> = props => {
    return (
        <Icon
            w="32px"
            h="32px"
            color="icon.primary"
            fill="none"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M14 14L4 14L14 4L14 14Z" fill="currentColor" />
            <path opacity="0.8" d="M14 14L4 28L4 14L14 14Z" fill="currentColor" />
            <path opacity="0.8" d="M28 4L14 4L14 14L28 4Z" fill="currentColor" />
            <path opacity="0.4" d="M14 14L28 28L4 28L14 14Z" fill="currentColor" />
            <path opacity="0.6" d="M28 28L28 4L14 14L28 28Z" fill="currentColor" />
        </Icon>
    );
};
