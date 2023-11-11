import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, chakra, Checkbox, FormControl } from '@chakra-ui/react';
import { InfoTooltip, NumberedTextArea } from 'src/shared';
import { observer } from 'mobx-react-lite';
import AutoSizer from 'react-virtualized-auto-sizer';

const GraphAnalyticsForm: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const textAreaLineHeight = 22;

    return (
        <chakra.form {...props} h="100%" display="flex" flexDirection="column">
            <FormControl alignItems="center" gap="1" display="flex" mb="3">
                <Checkbox mb="0 !important">Only between these accounts</Checkbox>
                <InfoTooltip>Description</InfoTooltip>
            </FormControl>
            <FormControl flex="1">
                <AutoSizer>
                    {({ height, width }) => (
                        <>
                            <NumberedTextArea
                                wrapperProps={{ height: 'fit-content', width, maxHeight: height }}
                                placeholder="Enter your query"
                                maxRows={
                                    height ? Math.floor((height - 40) / textAreaLineHeight) - 1 : 4
                                }
                                resize="none"
                                mb="5"
                            />
                            <Button w="fit-content">Send</Button>
                        </>
                    )}
                </AutoSizer>
            </FormControl>
        </chakra.form>
    );
};

export default observer(GraphAnalyticsForm);
