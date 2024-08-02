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
    MenuItem,
    useDisclosure
} from '@chakra-ui/react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { sitesStore } from '../model';
import { DTOTonSite, DeleteIcon24, EditIcon24, Span, VerticalDotsIcon16 } from 'src/shared';
import { useNavigate } from 'react-router-dom';
import { ConfirmationDialog } from 'src/entities';

const SiteListItem: FC<{ item: DTOTonSite }> = ({ item }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const domainEncoded = encodeURIComponent(item.domain);

    const onDelete = () => {
        sitesStore.deleteSite(item.id);
    };

    // FIXME: long domain names are not displayed correctly

    return (
        <>
            <Card w="100%">
                <CardHeader gap={3} paddingY={4}>
                    <Flex gap="4">
                        <Flex align="end" wrap="wrap" flex="1" columnGap="2">
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
                                <MenuItem
                                    icon={<EditIcon24 />}
                                    onClick={() => navigate(domainEncoded)}
                                >
                                    Edit
                                </MenuItem>
                                <MenuItem icon={<DeleteIcon24 />} onClick={onOpen}>
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </CardHeader>
                <CardBody borderBottomRadius={8} bgColor="background.contentTint">
                    <Stack direction="row">
                        {item.endpoints.map(domain => (
                            <Box
                                key={domain}
                                alignContent="center"
                                h={8}
                                fontSize={14}
                                fontWeight={600}
                                borderRadius={8}
                                bgColor="background.content"
                                paddingX={6}
                            >
                                {domain}
                            </Box>
                        ))}
                    </Stack>
                </CardBody>
            </Card>
            <ConfirmationDialog
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={onDelete}
                title="Delete domain"
                description="Are you sure you want to delete this domain?"
            />
        </>
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
