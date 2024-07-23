import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { TgUser, tGUserStore } from 'src/entities';
import {
    Box,
    Button,
    HStack,
    Image,
    Menu,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useBreakpointValue,
    useClipboard
} from '@chakra-ui/react';
import { ArrowIcon, DisconnectIcon, MenuButtonDefault, Span, TgIcon } from 'src/shared';

const ExistUserMenu: FC<{ user: TgUser }> = observer(({ user }) => {
    const { hasCopied, onCopy } = useClipboard(user.id.toString());

    return (
        <Menu placement="bottom">
            <MenuButtonDefault w="200px" rightIcon={<ArrowIcon />}>
                <HStack spacing="2">
                    {user.imageUrl && <Image w="7" h="7" borderRadius="100" src={user.imageUrl} />}
                    <Text textStyle="label2" noOfLines={1}>
                        {user.firstName} {user.lastName}
                    </Text>
                </HStack>
            </MenuButtonDefault>
            <MenuList w="216px">
                <Box fontSize={14} paddingX={3}>
                    My user ID:{' '}
                    <Tooltip closeOnClick={false} label={hasCopied ? 'Copied!' : 'Copy'}>
                        <Span fontFamily={'mono'} onClick={onCopy} _hover={{ cursor: 'pointer' }}>
                            {user.id}
                        </Span>
                    </Tooltip>
                </Box>
                <MenuItem onClick={() => tGUserStore.logout()}>
                    <DisconnectIcon mr="2" />
                    <Text textStyle="label2">Disconnect</Text>
                </MenuItem>
            </MenuList>
        </Menu>
    );
});

export const TgUserButton: FC = observer(() => {
    const buttonText = useBreakpointValue({
        base: 'Connect',
        md: 'Connect via Telegram'
    });

    return tGUserStore.user$.value ? (
        <ExistUserMenu user={tGUserStore.user$.value} />
    ) : (
        <Button
            isLoading={tGUserStore.user$.isLoading}
            leftIcon={<TgIcon />}
            onClick={() => tGUserStore.login()}
            variant="secondary"
        >
            {buttonText}
        </Button>
    );
});
