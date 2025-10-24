import { forwardRef, Icon, IconProps } from '@chakra-ui/react';

export const CloseIcon24 = forwardRef<IconProps, typeof Icon>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="24px"
            h="24px"
            color="icon.teritary"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.21967 5.21967C5.51256 4.92678 5.98744 4.92678 6.28033 5.21967L12 10.9393L17.7197 5.21967C18.0126 4.92678 18.4874 4.92678 18.7803 5.21967C19.0732 5.51256 19.0732 5.98744 18.7803 6.28033L13.0607 12L18.7803 17.7197C19.0732 18.0126 19.0732 18.4874 18.7803 18.7803C18.4874 19.0732 18.0126 19.0732 17.7197 18.7803L12 13.0607L6.28033 18.7803C5.98744 19.0732 5.51256 19.0732 5.21967 18.7803C4.92678 18.4874 4.92678 18.0126 5.21967 17.7197L10.9393 12L5.21967 6.28033C4.92678 5.98744 4.92678 5.51256 5.21967 5.21967Z"
                fill="currentColor"
            />
        </Icon>
    );
});

CloseIcon24.displayName = 'CloseIcon24';
