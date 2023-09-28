import { Icon, forwardRef } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const FilledTickIcon18 = forwardRef<ComponentProps<typeof Icon>, typeof Icon>(
    (props, ref) => {
        return (
            <Icon
                ref={ref}
                w="18px"
                h="18px"
                color="icon.primary"
                fill="none"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM13.2803 7.28033C13.5732 6.98744 13.5732 6.51256 13.2803 6.21967C12.9874 5.92678 12.5126 5.92678 12.2197 6.21967L7.5 10.9393L5.78033 9.21967C5.48744 8.92678 5.01256 8.92678 4.71967 9.21967C4.42678 9.51256 4.42678 9.98744 4.71967 10.2803L6.96967 12.5303C7.26256 12.8232 7.73744 12.8232 8.03033 12.5303L13.2803 7.28033Z"
                    fill="currentColor"
                />
            </Icon>
        );
    }
);

FilledTickIcon18.displayName = 'FilledTickIcon18';
