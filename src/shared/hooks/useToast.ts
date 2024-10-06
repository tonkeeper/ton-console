import {
    UseToastOptions,
    useToast as useChakraToast,
    createStandaloneToast as chakraCreateStandaloneToast,
    CreateToastFnReturn,
    ToastId
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

    const newToast = Object.assign(wrappedToast, chakraToast);

    newToast.update = (id: ToastId, options: UseToastOptions) => {
        const newOptions = options.status ? { ...options, variant: options.status } : options;
        return chakraToast.update(id, newOptions);
    };

    return newToast;
};

export const useToast = () => {
    const chakraToast = useChakraToast();
    return wrapToast(chakraToast);
};

export const createStandaloneToast = () => {
    const { toast: chakraToast } = chakraCreateStandaloneToast();
    return { toast: wrapToast(chakraToast) };
};
