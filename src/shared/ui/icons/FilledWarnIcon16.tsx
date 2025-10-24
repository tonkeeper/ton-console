import { Icon, IconProps, forwardRef } from '@chakra-ui/react';

export const FilledWarnIcon16 = forwardRef<IconProps, typeof Icon>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="16px"
            h="16px"
            color="icon.tertiary"
            fill="none"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11ZM8 4C7.45598 4 7.02277 4.45542 7.04994 4.99875L7.21255 8.25094C7.23353 8.67055 7.57986 9 8 9C8.42014 9 8.76647 8.67055 8.78745 8.25094L8.95006 4.99875C8.97723 4.45541 8.54402 4 8 4Z"
                fill="currentColor"
            />
        </Icon>
    );
});

FilledWarnIcon16.displayName = 'FilledWarnIcon16';
