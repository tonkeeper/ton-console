import { Icon } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const ArrowIcon: FunctionComponent<ComponentProps<typeof Icon>> = props => {
    return (
        <Icon
            w="16px"
            h="16px"
            fill="none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.39998 6.05004C2.64851 5.71867 3.11861 5.65152 3.44998 5.90004L7.99998 9.31254L12.55 5.90004C12.8814 5.65152 13.3515 5.71867 13.6 6.05004C13.8485 6.38141 13.7814 6.85152 13.45 7.10004L8.44998 10.85C8.18332 11.05 7.81665 11.05 7.54998 10.85L2.54998 7.10004C2.21861 6.85152 2.15145 6.38141 2.39998 6.05004Z"
                fill="#7E868F"
            />
        </Icon>
    );
};
