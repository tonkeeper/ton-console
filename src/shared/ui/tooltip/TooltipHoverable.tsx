import {
    cloneElement,
    ComponentProps,
    FunctionComponent,
    isValidElement,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
    useDisclosure
} from '@chakra-ui/react';

export const TooltipHoverable: FunctionComponent<
    PropsWithChildren<{ host: ReactElement | string } & ComponentProps<typeof Popover>>
> = ({ host, children, ...rest }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isOpenDebounced, setIsOpenDebounced] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsOpenDebounced(isOpen);
            return;
        }

        const timer = setTimeout(() => setIsOpenDebounced(isOpen), 200);
        return () => {
            clearTimeout(timer);
        };
    }, [isOpen]);

    const hostWithTrigger = useMemo(() => {
        const element = isValidElement(host) ? host : <span>{host}</span>;

        return cloneElement(element, {
            onMouseLeave: onClose,
            onMouseEnter: onOpen
        });
    }, [host, onOpen, onClose]);

    return (
        <Popover autoFocus={false} isOpen={isOpenDebounced} {...rest}>
            <PopoverTrigger>{hostWithTrigger}</PopoverTrigger>
            <PopoverContent
                w="inherit"
                minW="unset"
                maxW="100%"
                px="4"
                py="3"
                border="none"
                borderRadius="lg"
                whiteSpace="normal"
                filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04)) drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.12))"
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
            >
                {children}
                <PopoverArrow />
            </PopoverContent>
        </Popover>
    );
};
