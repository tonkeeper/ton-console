import { forwardRef, Icon, IconProps } from '@chakra-ui/react';

export const InfoIcon16 = forwardRef<IconProps, typeof Icon>((props, ref) => {
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
                d="M8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM9 5.09872C9 5.65101 8.55228 6.09872 8 6.09872C7.44772 6.09872 7 5.65101 7 5.09872C7 4.54644 7.44772 4.09872 8 4.09872C8.55228 4.09872 9 4.54644 9 5.09872ZM8 6.90128C7.58579 6.90128 7.25 7.23706 7.25 7.65128L7.25 11.1513C7.25 11.5655 7.58579 11.9013 8 11.9013C8.41421 11.9013 8.75 11.5655 8.75 11.1513L8.75 7.65128C8.75 7.23706 8.41421 6.90128 8 6.90128Z"
                fill="currentColor"
            />
        </Icon>
    );
});

InfoIcon16.displayName = 'InfoIcon16';
