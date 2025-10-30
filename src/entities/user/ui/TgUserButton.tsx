import { FC } from 'react';
import { User } from 'src/entities';
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
import { useUserQuery, useLoginMutation, useLogoutMutation } from 'src/entities/user/queries';

const ExistUserMenu: FC<{ user: User }> = ({ user }) => {
    const navigate = useNavigate();
    const logout = useLogoutMutation();

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
                <Flex textStyle="body2" gap={1} my={2} px={3}>
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
                <MenuItem onClick={() => logout.mutate()}>
                    <DisconnectIcon mr="2" />
                    <Text textStyle="label2">Disconnect</Text>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export const TgUserButton: FC = () => {
    const { data: user, isLoading } = useUserQuery();
    const login = useLoginMutation();

    const buttonText = useBreakpointValue({
        base: 'Connect',
        md: 'Connect via Telegram'
    });

    return user ? (
        <ExistUserMenu user={user} />
    ) : (
        <Button
            isLoading={isLoading || login.isPending}
            leftIcon={<TgIcon />}
            onClick={() => login.mutate()}
            variant="secondary"
        >
            {buttonText}
        </Button>
    );
};
