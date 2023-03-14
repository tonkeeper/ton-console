import {
    Children,
    cloneElement,
    FunctionComponent,
    isValidElement,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    useMemo
} from 'react';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { ArrowIcon } from 'src/shared';

export interface DropDownMenuItemExpandableProps extends PropsWithChildren {
    content: ReactNode;

    leftIcon?: ReactNode;

    layer?: number;
}

const _hover = { backgroundColor: 'background.contentTint' };
export const DropDownMenuItemExpandable: FunctionComponent<
    DropDownMenuItemExpandableProps
> = props => {
    const children = useMemo(() => {
        return Children.map(props.children, child => {
            if (!isValidElement<FunctionComponent<{ layer?: number }>>(child)) {
                return child;
            }

            return cloneElement(child as ReactElement<{ layer?: number }>, {
                layer: (props.layer || 0) + 1
            });
        });
    }, [props.children, props.layer]);

    return (
        <Accordion allowToggle>
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
