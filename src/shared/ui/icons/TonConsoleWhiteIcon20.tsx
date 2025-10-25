import { Icon, IconProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const TonConsoleWhiteIcon20 = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="20px"
            h="22px"
            fill="none"
            viewBox="0 0 20 22"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                opacity="0.8"
                d="M10.0011 0.379395L19.6562 5.85066L10.0011 11.0001L10.0011 0.379395Z"
                fill="white"
            />
            <path
                opacity="0.6"
                d="M19.6562 5.85059V16.1494L10.0011 11L19.6562 5.85059Z"
                fill="white"
            />
            <path
                opacity="0.5"
                d="M19.6562 16.1494L10.0011 21.6207L10.0011 11L19.6562 16.1494Z"
                fill="white"
            />
            <path
                opacity="0.6"
                d="M9.99999 21.6207L0.344828 16.1494L10 11L9.99999 21.6207Z"
                fill="white"
            />
            <path
                opacity="0.8"
                d="M0.344828 16.1494V5.85059L10 11L0.344828 16.1494Z"
                fill="white"
            />
            <path
                d="M0.344828 5.85066L9.99999 0.379395L10 11.0001L0.344828 5.85066Z"
                fill="white"
            />
        </Icon>
    );
});

TonConsoleWhiteIcon20.displayName = 'TonConsoleWhiteIcon20';
