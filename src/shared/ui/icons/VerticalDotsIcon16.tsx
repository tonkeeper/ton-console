import { Icon } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const VerticalDotsIcon16: FunctionComponent<ComponentProps<typeof Icon>> = props => {
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
                d="M8 5C7.30964 5 6.75 4.44036 6.75 3.75C6.75 3.05964 7.30964 2.5 8 2.5C8.69036 2.5 9.25 3.05964 9.25 3.75C9.25 4.44036 8.69036 5 8 5ZM8 9.25C7.30964 9.25 6.75 8.69036 6.75 8C6.75 7.30964 7.30964 6.75 8 6.75C8.69036 6.75 9.25 7.30964 9.25 8C9.25 8.69036 8.69036 9.25 8 9.25ZM6.75 12.25C6.75 12.9404 7.30964 13.5 8 13.5C8.69036 13.5 9.25 12.9404 9.25 12.25C9.25 11.5596 8.69036 11 8 11C7.30964 11 6.75 11.5596 6.75 12.25Z"
                fill="#7E868F"
            />
        </Icon>
    );
};
