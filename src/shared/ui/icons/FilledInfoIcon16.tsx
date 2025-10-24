import { forwardRef, Icon, IconProps } from '@chakra-ui/react';

export const FilledInfoIcon16 = forwardRef<IconProps, typeof Icon>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="16px"
            h="16px"
            color="icon.tertiary"
            fill="none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 5C9 5.55228 8.55228 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4C8.55228 4 9 4.44772 9 5ZM8 7C7.55817 7 7.2 7.35817 7.2 7.8L7.2 11.45C7.2 11.8918 7.55817 12.25 8 12.25C8.44183 12.25 8.8 11.8918 8.8 11.45L8.8 7.8C8.8 7.35817 8.44183 7 8 7Z"
                fill="currentColor"
            />
        </Icon>
    );
});

FilledInfoIcon16.displayName = 'FilledInfoIcon16';
