import {
    Children,
    cloneElement,
    FunctionComponent,
    isValidElement,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    useDisclosure
} from '@chakra-ui/react';
import { ArrowIcon } from 'src/shared';
import { useLocation } from 'react-router-dom';

export interface DropDownMenuItemExpandableProps extends PropsWithChildren {
    content: ReactNode;

    leftIcon?: ReactNode;

    layer?: number;

    linkTo?: string;

    path?: string;
}

const _hover = { backgroundColor: 'button.secondary.backgroundHover' };
export const DropDownMenuItemExpandable: FunctionComponent<
    DropDownMenuItemExpandableProps
> = props => {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const path = useMemo(() => {
        let value = props.path;
        if (value && props.linkTo) {
            value += `/${props.linkTo}`;
        }
        value ||= props.linkTo;
        return value;
    }, [props.path, props.linkTo]);

    const children = useMemo(() => {
        return Children.map(props.children, child => {
            if (!isValidElement<FunctionComponent<{ layer?: number }>>(child)) {
                return child;
            }

            return cloneElement(child as ReactElement<{ layer?: number; path?: string }>, {
                layer: (props.layer || 0) + 1,
                path
            });
        });
    }, [path, props.children, props.layer]);

    const { isOpen, onOpen, onToggle } = useDisclosure();

    const location = useLocation();

    useEffect(() => {
        const isMathLocation = location.pathname.startsWith('/' + path);

        if (isMathLocation) {
            onOpen();
        }
    }, [location.pathname, path]);

    const index = useMemo(() => {
        return isOpen ? [0] : [];
    }, [isOpen]);

    useEffect(() => setShouldAnimate(true), []);

    return (
        <Accordion allowToggle index={index} reduceMotion={!shouldAnimate}>
            <AccordionItem border="none">
                {({ isExpanded }) => (
                    <>
                        <AccordionButton
                            textStyle={props.layer ? 'body2' : 'label2'}
                            justifyContent="space-between"
                            gap="3"
                            display="flex"
                            pr="3"
                            pl={props.layer ? props.layer * 16 : 3}
                            py="2" /*Chakra UI bug workaround*/
                            color="text.primary"
                            fontSize="14px"
                            borderRadius="md"
                            _hover={_hover}
                            transition=""
                            onClick={onToggle}
                        >
                            {props.leftIcon}
                            <Box textAlign="left" wordBreak="break-all" noOfLines={1}>
                                {props.content}
                            </Box>
                            <ArrowIcon
                                ml="auto"
                                transform={`rotate(${isExpanded ? '180deg' : 0})`}
                                transition="transform 0.1s ease-in-out"
                            />
                        </AccordionButton>
                        <AccordionPanel textStyle="body2" p={0} pb={4}>
                            {children}
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>
        </Accordion>
    );
};
