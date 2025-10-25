import {
    Children,
    cloneElement,
    FC,
    isValidElement,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useCallback,
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
import { useLocation, useNavigate } from 'react-router-dom';

export interface DropDownMenuItemExpandableProps extends PropsWithChildren {
    content: ReactNode;

    leftIcon?: ReactNode;

    layer?: number;

    linkTo?: string;

    path?: string;
}

const _hover = { backgroundColor: 'button.secondary.backgroundHover' };
export const DropDownMenuItemExpandable: FC<DropDownMenuItemExpandableProps> = props => {
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
            if (!isValidElement<FC<{ layer?: number }>>(child)) {
                return child;
            }

            return cloneElement(child as ReactElement<{ layer?: number; path?: string }>, {
                layer: (props.layer || 0) + 1,
                path
            });
        });
    }, [path, props.children, props.layer]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const location = useLocation();
    const navigate = useNavigate();
    const isMathLocation = location.pathname.startsWith('/' + path);

    useEffect(() => {
        if (isMathLocation) {
            onOpen();
        } else {
            onClose();
        }
    }, [isMathLocation, onOpen, onClose]);

    const index = useMemo(() => {
        return isOpen ? [0] : [];
    }, [isOpen]);

    useEffect(() => setShouldAnimate(true), []);

    const onClick = useCallback(() => {
        if (isMathLocation) {
            return;
        }
        navigate(path!);
    }, [isMathLocation, path, navigate]);

    return (
        <Accordion allowToggle index={index} reduceMotion={!shouldAnimate}>
            <AccordionItem border="none">
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
                    onClick={onClick}
                >
                    {props.leftIcon}
                    <Box textAlign="left" wordBreak="break-all" noOfLines={1}>
                        {props.content}
                    </Box>
                    <ArrowIcon ml="auto" />
                </AccordionButton>
                <AccordionPanel textStyle="body2" p={0} pb={4}>
                    {children}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
