import { Icon, IconProps, forwardRef, useTheme } from '@chakra-ui/react';

export const SortDescIcon16 = forwardRef<IconProps & { accentColor?: string }, typeof Icon>(
    ({ accentColor, ...rest }, ref) => {
        const theme = useTheme();

        return (
            <Icon
                ref={ref}
                w="16px"
                h="16px"
                color="icon.secondary"
                fill="none"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                {...rest}
            >
                <path
                    d="M3.69495 10.1463C3.36148 9.90055 2.89197 9.97168 2.64626 10.3051C2.40055 10.6386 2.47168 11.1081 2.80515 11.3538L7.55515 14.8538C7.81972 15.0488 8.18038 15.0488 8.44495 14.8538L13.1949 11.3538C13.5284 11.1081 13.5996 10.6386 13.3538 10.3051C13.1081 9.97168 12.6386 9.90055 12.3052 10.1463L8.00005 13.3184L3.69495 10.1463Z"
                    fill={accentColor || theme.colors.icon.primary}
                />
                <path
                    d="M3.69495 5.85374C3.36148 6.09945 2.89197 6.02832 2.64626 5.69485C2.40055 5.36139 2.47168 4.89187 2.80515 4.64616L7.55515 1.14616C7.81972 0.951213 8.18038 0.951213 8.44495 1.14616L13.1949 4.64616C13.5284 4.89187 13.5996 5.36139 13.3538 5.69485C13.1081 6.02832 12.6386 6.09945 12.3052 5.85374L8.00005 2.68156L3.69495 5.85374Z"
                    fill="currentColor"
                />
            </Icon>
        );
    }
);

SortDescIcon16.displayName = 'SortDescIcon16';
