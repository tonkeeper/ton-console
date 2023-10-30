import { forwardRef, Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const TickIcon = forwardRef<
    ComponentProps<typeof Icon> & { isIndeterminate?: unknown; isChecked?: unknown },
    typeof Icon
>((props, ref) => {
    const { isIndeterminate: _, isChecked: __, ...rest } = props;
    return (
        <Icon
            ref={ref}
            w="16px"
            h="16px"
            fill="none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.7803 4.21967C14.0732 4.51256 14.0732 4.98744 13.7803 5.28033L6.53033 12.5303C6.23744 12.8232 5.76256 12.8232 5.46967 12.5303L2.21967 9.28033C1.92678 8.98744 1.92678 8.51256 2.21967 8.21967C2.51256 7.92678 2.98744 7.92678 3.28033 8.21967L6 10.9393L12.7197 4.21967C13.0126 3.92678 13.4874 3.92678 13.7803 4.21967Z"
                fill="currentColor"
            />
        </Icon>
    );
});

TickIcon.displayName = 'TickIcon';
