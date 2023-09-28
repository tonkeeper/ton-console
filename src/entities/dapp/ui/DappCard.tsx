import { ComponentProps, FunctionComponent } from 'react';
import {
    Box,
    Card,
    CardBody,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import { DeleteIcon24, IconButton, Image, VerticalDotsIcon16 } from 'src/shared';
import { Dapp, dappStore } from 'src/entities';
import { ConfirmDappDeleteModal } from './ConfirmDappDeleteModal';
import { observer } from 'mobx-react-lite';

const DappCard: FunctionComponent<
    ComponentProps<typeof Card> & {
        dapp: Pick<Dapp, 'name' | 'image' | 'url'> & { id?: Dapp['id'] };
        withMenu?: boolean;
    }
> = ({ dapp, withMenu, ...rest }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onDelete = (confirm?: boolean): void => {
        onClose();
        if (confirm && dapp.id !== undefined) {
            dappStore.deleteValidatedDapp(dapp.id);
        }
    };

    return (
        <>
            <Card w="fit-content" maxW="100%" {...rest}>
                <CardBody alignItems="center" gap="3" display="flex" px="4" py="4">
                    <Image borderRadius="sm" w="12" h="12" minW="12" src={dapp.image} />
                    <Box>
                        <Text
                            textStyle="label2"
                            mb="2"
                            color="text.primary"
                            fontFamily="mono"
                            wordBreak="break-word"
                            noOfLines={1}
                        >
                            {dapp.url}
                        </Text>
                        <Text
                            textStyle="label2"
                            color="text.secondary"
                            wordBreak="break-word"
                            noOfLines={1}
                        >
                            {dapp.name}
                        </Text>
                    </Box>
                    {withMenu && (
                        <Menu placement="bottom-end">
                            <MenuButton
                                as={IconButton}
                                alignSelf="flex-start"
                                h="4"
                                aria-label="options"
                                icon={<VerticalDotsIcon16 />}
                            />
                            <MenuList w="132px">
                                <MenuItem onClick={onOpen}>
                                    <DeleteIcon24 mr="2" />
                                    <Text textStyle="label2" fontFamily="body">
                                        Delete
                                    </Text>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                </CardBody>
            </Card>
            <ConfirmDappDeleteModal appUrl={dapp.url} isOpen={isOpen} onClose={onDelete} />
        </>
    );
};

export default observer(DappCard);
