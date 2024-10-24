import { FC } from 'react';
import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardProps,
    List,
    ListIcon,
    ListItem,
    Text
} from '@chakra-ui/react';
import { ButtonLink, EXTERNAL_LINKS, H2, TickIcon } from 'src/shared';

export const TonApiUnlimitedTierCard: FC<CardProps> = props => {
    const { ...rest } = props;

    return (
        <Card display={'flex'} size="xl" {...rest}>
            <CardHeader>
                <Text textStyle="label2" color="text.primary">
                    Custom
                </Text>
            </CardHeader>
            <CardBody flexDir="column" display="flex" w="100%">
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
                <ButtonLink w="100%" href={EXTERNAL_LINKS.SUPPORT} isExternal variant="contrast">
                    Contact support
                </ButtonLink>
            </CardFooter>
        </Card>
    );
};
