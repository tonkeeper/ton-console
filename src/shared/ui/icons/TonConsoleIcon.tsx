import { Icon } from '@chakra-ui/react';
import { ComponentProps, forwardRef } from 'react';

export const TonConsoleIcon = forwardRef<SVGElement, ComponentProps<typeof Icon>>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="32px"
            h="32px"
            fill="none"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                opacity="0.2"
                d="M15.999 1.7002L28.999 9.06677L15.999 16L15.999 1.7002Z"
                fill="black"
            />
            <path
                opacity="0.3"
                d="M28.999 9.06665V22.9332L15.999 15.9999L28.999 9.06665Z"
                fill="black"
            />
            <path
                opacity="0.4"
                d="M28.999 22.9333L15.999 30.2998L15.999 16L28.999 22.9333Z"
                fill="black"
            />
            <path
                opacity="0.3"
                d="M15.999 30.2998L2.99902 22.9333L15.999 16L15.999 30.2998Z"
                fill="black"
            />
            <path
                opacity="0.2"
                d="M2.99902 22.9332V9.06665L15.999 15.9999L2.99902 22.9332Z"
                fill="black"
            />
            <path
                opacity="0.1"
                d="M2.99902 9.06677L15.999 1.7002L15.999 16L2.99902 9.06677Z"
                fill="black"
            />
        </Icon>
    );
});

TonConsoleIcon.displayName = 'TonConsoleIcon';
