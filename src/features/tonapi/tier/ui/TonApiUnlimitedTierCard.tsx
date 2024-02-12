import { ComponentProps, FunctionComponent } from 'react';
import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    List,
    ListIcon,
    ListItem,
    Text
} from '@chakra-ui/react';
import { ButtonLink, EXTERNAL_LINKS, H2, TickIcon } from 'src/shared';

export const TonApiUnlimitedTierCard: FunctionComponent<
    ComponentProps<typeof Card> & { buttonProps?: ComponentProps<typeof ButtonLink> }
> = props => {
    const { buttonProps, ...rest } = props;

    return (
        <Card size="xl" variant="outline" {...rest}>
            <CardHeader>
                <Text textStyle="label2" color="text.primary">
                    Custom
                </Text>
            </CardHeader>
            <CardBody flexDir="column" display="flex">
                <H2 mb="6">Unlimited</H2>

                <List flex="1" spacing="2">
                    <ListItem display="flex">
                        <ListIcon as={TickIcon} color="accent.green" />
                        <Box textStyle="body2" color="text.primary">
                            Unlimited requests per second
                        </Box>
                    </ListItem>
                    <ListItem display="flex">
                        <ListIcon as={TickIcon} color="accent.green" />
                        <Box textStyle="body2" color="text.primary">
                            Unlimited realtime connections
                        </Box>
                    </ListItem>
                </List>
            </CardBody>
            <CardFooter>
                <ButtonLink
                    w="100%"
                    href={EXTERNAL_LINKS.SUPPORT}
                    isExternal
                    variant="secondary"
                    {...buttonProps}
                >
                    Contact support
                </ButtonLink>
            </CardFooter>
        </Card>
    );
};
