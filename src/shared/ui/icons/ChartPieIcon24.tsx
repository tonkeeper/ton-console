import { forwardRef, Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const ChartPieIcon24 = forwardRef<ComponentProps<typeof Icon>, typeof Icon>((props, ref) => {
    return (
        <Icon
            ref={ref}
            w="24px"
            h="24px"
            color="icon.primary"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.0458 11.9838C17.2066 11.9838 17.287 11.9838 17.3515 12.0187C17.4053 12.0478 17.4544 12.1013 17.4789 12.1573C17.5083 12.2245 17.5021 12.2985 17.4896 12.4465C17.4115 13.372 17.1002 14.2655 16.5814 15.0419C15.9765 15.9471 15.1169 16.6526 14.111 17.0692C13.1052 17.4859 11.9984 17.5949 10.9307 17.3825C9.86288 17.1701 8.88207 16.6458 8.11224 15.876C7.34242 15.1062 6.81816 14.1254 6.60577 13.0576C6.39338 11.9899 6.50239 10.8831 6.91901 9.87728C7.33564 8.87146 8.04117 8.01178 8.94638 7.40694C9.59347 6.97457 10.3218 6.68632 11.0823 6.55707C11.3479 6.51192 11.4808 6.48934 11.6258 6.54285C11.7406 6.58518 11.8665 6.69153 11.9275 6.79756C12.0045 6.9316 12.0045 7.08969 12.0045 7.40589V11.9838H17.0458ZM15.5467 13.1242C15.7983 13.1242 15.9242 13.1242 15.9967 13.1721C16.0595 13.2135 16.1048 13.28 16.1204 13.3535C16.1385 13.4386 16.0968 13.5449 16.0133 13.7576C15.9517 13.9145 15.8513 14.1063 15.6446 14.4155C15.1636 15.1354 14.4799 15.6966 13.6799 16.0279C12.8799 16.3593 11.9997 16.446 11.1504 16.2771C10.3012 16.1081 9.52114 15.6912 8.90888 15.0789C8.29662 14.4667 7.87966 13.6866 7.71074 12.8374C7.54181 11.9881 7.62851 11.1079 7.95987 10.3079C8.29122 9.50798 8.85235 8.82425 9.5723 8.3432C9.85108 8.15693 10.0915 8.03488 10.2871 7.95381C10.453 7.8851 10.5359 7.85074 10.6221 7.86787C10.6916 7.88171 10.7669 7.93202 10.8064 7.991C10.8552 8.06404 10.8552 8.16891 10.8552 8.37866V11.7342C10.8552 12.2207 10.8552 12.464 10.9498 12.6498C11.0331 12.8133 11.166 12.9462 11.3295 13.0295C11.5153 13.1242 11.7586 13.1242 12.2451 13.1242H15.5467ZM13.1668 6.91808C13.1659 6.74003 13.3247 6.60307 13.4965 6.64981C13.8822 6.75473 14.2871 6.93928 14.741 7.19343C15.3265 7.52131 15.5179 7.68068 15.915 8.0855C16.312 8.49032 16.6694 8.9473 16.9092 9.43142C17.0933 9.80294 17.2107 10.0892 17.3187 10.4544C17.3722 10.6352 17.2332 10.8129 17.0446 10.8129H13.4756C13.3162 10.8129 13.1868 10.6842 13.186 10.5249L13.1668 6.91808Z"
                fill="currentColor"
            />
        </Icon>
    );
});
