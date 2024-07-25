import {
    TableContainerProps,
    Box,
    VStack,
    Card,
    CardBody,
    CardHeader,
    Flex,
    IconButton,
    Stack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { sitesStore } from '../model';
import { Site } from '../model/sites.store';
import { DeleteIcon24, EditIcon24, Span, VerticalDotsIcon16 } from 'src/shared';

const SiteListItem: FC<{ item: Site }> = ({ item }) => {
    const onDelete = () => {
        sitesStore.deleteSite(item.id);
    };

    // FIXME: long domain names are not displayed correctly

    return (
        <Card w="100%">
            <CardHeader gap={3} paddingY={4}>
                <Flex gap="4">
                    <Flex align="end" flex="1" gap="2">
                        <Span fontWeight={600}>{item.domain}</Span>
                        <Span
                            fontWeight={400}
                            fontSize={14}
                            lineHeight="22px"
                            color="text.secondary"
                        >
                            {item.adnl_address}
                        </Span>
                    </Flex>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            w={6}
                            aria-label="See menu"
                            icon={<VerticalDotsIcon16 />}
                            size="xsm"
                            variant="ghost"
                        />
                        <MenuList>
                            <MenuItem icon={<EditIcon24 />}>Edit</MenuItem>
                            <MenuItem icon={<DeleteIcon24 />} onClick={onDelete}>
                                Delete
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </CardHeader>
            <CardBody borderBottomRadius={8} bgColor="background.contentTint">
                <Stack direction="row">
                    {item.endpoints.map(endpoint => (
                        <Box
                            key={endpoint}
                            alignContent="center"
                            h={8}
                            fontSize={14}
                            fontWeight={600}
                            borderRadius={8}
                            bgColor="background.content"
                            paddingX={6}
                        >
                            {endpoint}
                        </Box>
                    ))}
                </Stack>
            </CardBody>
        </Card>
    );
};

const SiteList: FC<TableContainerProps> = props => (
    <Box {...props}>
        <VStack maxW="710px">
            {sitesStore.sites$.value.map(site => (
                <SiteListItem key={site.id} item={site} />
            ))}
        </VStack>
    </Box>
);

export default observer(SiteList);
