import { Icon } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const TonConsoleIcon: FunctionComponent<ComponentProps<typeof Icon>> = props => {
    return (
        <Icon
            w="28px"
            h="28px"
            fill="none"
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect width="28" height="28" rx="8" fill="black" />
            <path opacity="0.76" d="M14 14V5L5 14H14Z" fill="white" />
            <path opacity="0.48" d="M14 14V23L5 14H14Z" fill="white" />
            <path d="M14 14V5L23 14H14Z" fill="white" />
            <path opacity="0.64" d="M14 14V23L23 14H14Z" fill="white" />
        </Icon>
    );
};
