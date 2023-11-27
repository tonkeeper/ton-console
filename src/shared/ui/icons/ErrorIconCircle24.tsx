import { forwardRef, Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const ErrorIconCircle24 = forwardRef<ComponentProps<typeof Icon>, typeof Icon>(
    (props, ref) => {
        return (
            <Icon
                ref={ref}
                w="24px"
                h="24px"
                color="accent.red"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                <circle cx="12" cy="12" r="9" fill="currentColor" />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.0384 7.99926L11.2212 12.7506C11.2373 13.169 11.5812 13.5 12 13.5C12.4188 13.5 12.7627 13.169 12.7788 12.7506L12.9616 7.99926C12.9825 7.45371 12.546 7 12 7C11.454 7 11.0175 7.45371 11.0384 7.99926ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                    fill="white"
                />
            </Icon>
        );
    }
);

ErrorIconCircle24.displayName = 'ErrorIconCircle24';
