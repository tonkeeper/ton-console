import { FC, useEffect } from 'react';
import {
    Box,
    Flex,
    Text,
    Image,
    IconButton,
    Tooltip,
    Center,
    Divider,
    VStack
} from '@chakra-ui/react';
import { CopyPad, DisconnectIcon, H4, Overlay } from 'src/shared';
import { useUserQuery, useUpdateUserMutation, useLogoutMutation } from 'src/entities/user/queries';

const UserProfilePage: FC = () => {
    const { data: user } = useUserQuery();
    const updateUser = useUpdateUserMutation();
    const logout = useLogoutMutation();

    useEffect(() => {
        updateUser.mutate();
    }, []);

    if (!user) {
        throw new Error('Missing user for show profile');
    }

    const getReferralURL = () => {
        const { protocol, hostname, port } = window.location;
        return `${protocol}//${hostname}${port ? `:${port}` : ''}/?referral=${user.referralId}`;
    };

    return (
        <VStack align="stretch" spacing="4">
            {/* Account section */}
            <Overlay h="fit-content">
                <Flex align="center" justify="space-between" mb="4">
                    <H4>Account</H4>
                    <Tooltip hasArrow label="Disconnect" placement="left">
                        <IconButton
                            color="text.secondary"
                            _hover={{ color: 'accent.red' }}
                            aria-label="Disconnect"
                            icon={<DisconnectIcon />}
                            isLoading={logout.isPending}
                            onClick={() => logout.mutate()}
                            size="sm"
                            variant="ghost"
                        />
                    </Tooltip>
                </Flex>
                <Divider w="auto" mx="-6" mb="4" />

                <Flex align="center" gap="4">
                    {user.imageUrl ? (
                        <Image
                            w="56px"
                            h="56px"
                            borderRadius="lg"
                            alt={user.name}
                            src={user.imageUrl}
                        />
                    ) : (
                        <Center
                            w="56px"
                            h="56px"
                            color="text.primary"
                            fontSize="xl"
                            fontWeight="medium"
                            bg="background.contentTint"
                            borderRadius="lg"
                        >
                            {user.name?.[0] || '?'}
                        </Center>
                    )}
                    <Box>
                        <Text textStyle="label1" mb="1">
                            {user.name}
                        </Text>
                        <Flex align="center" gap="1">
                            <Text textStyle="body2" color="text.secondary">
                                ID:
                            </Text>
                            <CopyPad
                                variant="flat"
                                size="sm"
                                text={user.id.toString()}
                            />
                        </Flex>
                    </Box>
                </Flex>
            </Overlay>

            {/* Referral section */}
            <Overlay h="fit-content">
                <Text textStyle="label1" mb="4">
                    Referral Program
                </Text>
                <Divider w="auto" mx="-6" mb="4" />

                <Flex
                    align={{ base: 'stretch', md: 'center' }}
                    justify="space-between"
                    direction={{ base: 'column', md: 'row' }}
                    gap="4"
                >
                    <Box
                        minW="120px"
                        px="4"
                        py="3"
                        bg="background.contentTint"
                        borderRadius="md"
                    >
                        <Text textStyle="body2" mb="1" color="text.secondary">
                            Invited Users
                        </Text>
                        <Text textStyle="label1" fontSize="xl">
                            {user.referralCount}
                        </Text>
                    </Box>

                    <Box flex="1">
                        <Text textStyle="body2" mb="2" color="text.secondary">
                            Your Referral Link
                        </Text>
                        <CopyPad text={getReferralURL()} />
                    </Box>
                </Flex>
            </Overlay>
        </VStack>
    );
};

export default UserProfilePage;
