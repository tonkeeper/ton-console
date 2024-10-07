import { Icon, IconProps } from '@chakra-ui/react';
import { FC } from 'react';

export const ChevronRightIcon16: FC<IconProps> = props => {
    return (
        <Icon
            w="16px"
            h="16px"
            color="icon.secondary"
            fill="none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.27324 3.17107C6.59298 2.90775 7.06565 2.9535 7.32897 3.27324L10.829 7.52324C11.057 7.80019 11.057 8.19986 10.829 8.4768L7.32897 12.7268C7.06565 13.0465 6.59298 13.0923 6.27324 12.829C5.9535 12.5656 5.90776 12.093 6.17107 11.7732L9.27843 8.00002L6.17107 4.2268C5.90775 3.90706 5.9535 3.43439 6.27324 3.17107Z"
                fill="currentColor"
            />
        </Icon>
    );
};
