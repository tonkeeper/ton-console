import { forwardRef, Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const DoneIconCircle24 = forwardRef<ComponentProps<typeof Icon>, typeof Icon>(
    (props, ref) => {
        return (
            <Icon
                ref={ref}
                w="24px"
                h="24px"
                color="accent.green"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                <circle cx="12" cy="12" r="9" fill="currentColor" />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.2803 9.21967C16.5732 9.51256 16.5732 9.98744 16.2803 10.2803L11.0303 15.5303C10.7374 15.8232 10.2626 15.8232 9.96967 15.5303L7.71967 13.2803C7.42678 12.9874 7.42678 12.5126 7.71967 12.2197C8.01256 11.9268 8.48744 11.9268 8.78033 12.2197L10.5 13.9393L15.2197 9.21967C15.5126 8.92678 15.9874 8.92678 16.2803 9.21967Z"
                    fill="white"
                />
            </Icon>
        );
    }
);

DoneIconCircle24.displayName = 'DoneIconCircle24';
