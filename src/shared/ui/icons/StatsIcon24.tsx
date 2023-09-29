import { forwardRef, Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const StatsIcon24 = forwardRef<ComponentProps<typeof Icon>, typeof Icon>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="24px"
            h="24px"
            color="icon.primary"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.25 4C8.66421 4 9 4.33579 9 4.75V19.25C9 19.6642 8.66421 20 8.25 20C7.83579 20 7.5 19.6642 7.5 19.25V4.75C7.5 4.33579 7.83579 4 8.25 4ZM4.75 14C5.16421 14 5.5 14.3358 5.5 14.75V19.25C5.5 19.6642 5.16421 20 4.75 20C4.33579 20 4 19.6642 4 19.25V14.75C4 14.3358 4.33579 14 4.75 14ZM12.5 9.75C12.5 9.33579 12.1642 9 11.75 9C11.3358 9 11 9.33579 11 9.75V19.25C11 19.6642 11.3358 20 11.75 20C12.1642 20 12.5 19.6642 12.5 19.25V9.75ZM15.25 12C15.6642 12 16 12.3358 16 12.75V19.25C16 19.6642 15.6642 20 15.25 20C14.8358 20 14.5 19.6642 14.5 19.25V12.75C14.5 12.3358 14.8358 12 15.25 12ZM19.5 8.75C19.5 8.33579 19.1642 8 18.75 8C18.3358 8 18 8.33579 18 8.75V19.25C18 19.6642 18.3358 20 18.75 20C19.1642 20 19.5 19.6642 19.5 19.25V8.75Z"
                fill="currentColor"
            />
        </Icon>
    );
});

StatsIcon24.displayName = 'StatsIcon24';
