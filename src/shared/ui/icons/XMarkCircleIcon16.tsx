import { Icon, forwardRef } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const XMarkCircleIcon16 = forwardRef<ComponentProps<typeof Icon>, typeof Icon>(
    (props, ref) => {
        return (
            <Icon
                ref={ref}
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
                    d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM6.00256 4.94189C5.70967 4.649 5.23479 4.649 4.9419 4.94189C4.64901 5.23479 4.64901 5.70966 4.9419 6.00255L6.93935 8L4.9419 9.99745C4.64901 10.2903 4.64901 10.7652 4.9419 11.0581C5.23479 11.351 5.70967 11.351 6.00256 11.0581L8.00001 9.06066L9.99745 11.0581C10.2903 11.351 10.7652 11.351 11.0581 11.0581C11.351 10.7652 11.351 10.2903 11.0581 9.99745L9.06067 8L11.0581 6.00255C11.351 5.70966 11.351 5.23479 11.0581 4.94189C10.7652 4.649 10.2903 4.649 9.99745 4.94189L8.00001 6.93934L6.00256 4.94189Z"
                    fill="currentColor"
                />
            </Icon>
        );
    }
);

XMarkCircleIcon16.displayName = 'XMarkCircleIcon16';
