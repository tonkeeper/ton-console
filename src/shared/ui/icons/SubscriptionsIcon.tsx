import { Icon } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';

export const SubscriptionsIcon: FunctionComponent<ComponentProps<typeof Icon>> = props => {
    return (
        <Icon
            w="24px"
            h="24px"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.83463 7.18341 4.41279 11.25 4.03469V13.4393L8.78033 10.9697C8.48744 10.6768 8.01256 10.6768 7.71967 10.9697C7.42678 11.2626 7.42678 11.7374 7.71967 12.0303L11.4697 15.7803C11.7626 16.0732 12.2374 16.0732 12.5303 15.7803L16.2803 12.0303C16.5732 11.7374 16.5732 11.2626 16.2803 10.9697C15.9874 10.6768 15.5126 10.6768 15.2197 10.9697L12.75 13.4393V4.03469C16.8166 4.41279 20 7.83463 20 12ZM21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z"
                fill="black"
            />
        </Icon>
    );
};
