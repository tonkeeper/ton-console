import {
    UseToastOptions,
    useToast as useChakraToast,
    createStandaloneToast as chakraCreateStandaloneToast,
    CreateToastFnReturn
} from '@chakra-ui/react';

const wrapToast = (chakraToast: CreateToastFnReturn): CreateToastFnReturn => {
    const wrappedToast = (options?: UseToastOptions) =>
        chakraToast({
            position: 'bottom-left',
            isClosable: true,
            duration: 5000,
            variant: options?.status,
            ...options
        });

    return Object.assign(wrappedToast, chakraToast);
};

export const useToast = () => {
    const chakraToast = useChakraToast();
    return wrapToast(chakraToast);
};

export const createStandaloneToast = () => {
    const { toast: chakraToast } = chakraCreateStandaloneToast();
    return { toast: wrapToast(chakraToast) };
};
