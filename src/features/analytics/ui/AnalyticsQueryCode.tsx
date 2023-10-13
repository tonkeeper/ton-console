import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { CodeArea, CodeAreaFooter, CodeAreaGroup, Span } from 'src/shared';

export const AnalyticsQueryCode: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props}>
            <CodeAreaGroup>
                <CodeArea value="123" onChange={() => {}} />
                <CodeAreaFooter>
                    <Flex align="center" justify="space-between">
                        <Span textStyle="label2">Explain</Span>
                        <Box>
                            <Span opacity="0.6" fontFamily="mono">
                                ≈ 30 min · $0.15
                            </Span>
                            <Button ml="4" size="sm" variant="contrast">
                                Run
                            </Button>
                        </Box>
                    </Flex>
                </CodeAreaFooter>
            </CodeAreaGroup>
        </Box>
    );
};
