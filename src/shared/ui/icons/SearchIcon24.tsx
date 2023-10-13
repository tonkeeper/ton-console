import { Icon, forwardRef } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const SearchIcon24 = forwardRef<ComponentProps<typeof Icon>, typeof Icon>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="24px"
            h="24px"
            color="icon.secondary"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.5 11C16.5 14.0376 14.0376 16.5 11 16.5C7.96243 16.5 5.5 14.0376 5.5 11C5.5 7.96243 7.96243 5.5 11 5.5C14.0376 5.5 16.5 7.96243 16.5 11ZM15.3911 16.4518C14.1902 17.4202 12.6628 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 12.6628 17.4202 14.1902 16.4518 15.3911L19.2803 18.2197C19.5732 18.5126 19.5732 18.9874 19.2803 19.2803C18.9874 19.5732 18.5126 19.5732 18.2197 19.2803L15.3911 16.4518Z"
                fill="currentColor"
            />
        </Icon>
    );
});

SearchIcon24.displayName = 'SearchIcon24';
