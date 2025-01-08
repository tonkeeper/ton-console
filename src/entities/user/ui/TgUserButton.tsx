import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { User, userStore } from 'src/entities';
import {
    Button,
    Flex,
    HStack,
    Image,
    Menu,
    MenuItem,
    MenuList,
    Text,
    useBreakpointValue
} from '@chakra-ui/react';
import { ArrowIcon, CopyPad, DisconnectIcon, MenuButtonDefault, TgIcon } from 'src/shared';
import { ProfileIcon24 } from 'src/shared/ui/icons/ProfileIcon24';
import { useNavigate } from 'react-router-dom';

const ExistUserMenu: FC<{ user: User }> = observer(({ user }) => {
    const navigate = useNavigate();

    return (
        <Menu placement="bottom">
            <MenuButtonDefault w="200px" rightIcon={<ArrowIcon />}>
                <HStack spacing="2">
                    {user.imageUrl && <Image w="7" h="7" borderRadius="100" src={user.imageUrl} />}
                    <Text textStyle="label2" noOfLines={1}>
                        {user.name}
                    </Text>
                </HStack>
            </MenuButtonDefault>
            <MenuList w="216px">
                <Flex textStyle="body2" gap={1} marginY={2} paddingX={3}>
                    My user ID:{' '}
                    <CopyPad
                        variant="flat"
                        size="sm"
                        text={user.id.toString()}
                        iconAlign="start"
                        hideCopyIcon
                    />
                </Flex>
                <MenuItem onClick={() => navigate('/profile')}>
                    <ProfileIcon24 mr="2" />
                    <Text textStyle="label2">Profile</Text>
                </MenuItem>
                <MenuItem onClick={() => userStore.logout()}>
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

    return userStore.isAuthorized() ? (
        <ExistUserMenu user={userStore.user$.value} />
    ) : (
        <Button
            isLoading={userStore.user$.isLoading}
            leftIcon={<TgIcon />}
            onClick={() => userStore.login()}
            variant="secondary"
        >
            {buttonText}
        </Button>
    );
});
