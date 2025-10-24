import { Icon, IconProps, forwardRef } from '@chakra-ui/react';

export const ConsoleDocsIcon32 = forwardRef<IconProps, typeof Icon>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="32px"
            h="32px"
            fill="none"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path opacity="0.1" d="M14 14L4 14L14 4L14 14Z" fill="#161C30" />
            <path opacity="0.2" d="M14 14L4 28L4 14L14 14Z" fill="#161C30" />
            <path opacity="0.2" d="M28 4L14 4L14 14L28 4Z" fill="#161C30" />
            <path opacity="0.4" d="M14 14L28 28L4 28L14 14Z" fill="#161C30" />
            <path opacity="0.3" d="M28 28L28 4L14 14L28 28Z" fill="#161C30" />
        </Icon>
    );
});

ConsoleDocsIcon32.displayName = 'ConsoleDocsIcon32';
