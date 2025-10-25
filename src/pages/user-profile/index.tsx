import { FC, useEffect } from 'react';
import { Box, Divider, Flex, Text, Image } from '@chakra-ui/react';
import { CopyPad, H4, Overlay } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { userStore } from 'src/shared/stores';
import { StatsCard } from 'src/entities/stats/Card';

const UserProfilePage: FC = () => {
    useEffect(() => {
        userStore.updateMe();
    }, []);

    const user = userStore.user$.value;

    if (!user) {
        throw new Error('Missing user for show profile');
    }

    const getRefferalURLURI = () => {
        const { protocol, hostname, port } = window.location;
        return `${protocol}//${hostname}${port ? `:${port}` : ''}/?referral=${user.referralId}`;
    };

    return (
        <Overlay>
            <H4 mb="5">Profile</H4>
            <Divider w="auto" mx="-6" mb="4" />

            <Flex direction="column" w="100%" maxW="512px">
                <Flex gap={3}>
                    <Image
                        w="3.5em"
                        h="3.5em"
                        borderRadius={6}
                        alt={user.id.toString()}
                        src={user.imageUrl}
                    />
                    <Box>
                        <Text textStyle="label2" mt={1}>
                            {user.name}
                        </Text>
                        <Flex textStyle="body2" gap={1} my={2}>
                            <Text textStyle="label2">User ID:</Text> {/* User ID:{' '} */}
                            <CopyPad
                                variant="flat"
                                size="sm"
                                text={user.id.toString()}
                                paddingRight={'1'}
                            />
                        </Flex>
                    </Box>
                </Flex>
                {/* <Text textStyle="label2" fontSize={16} mt={5} mb={2}>
                    Affiliate Program
                </Text>
                <Text textStyle="body2" textColor="text.secondary">
                    As an affiliate, you can earn _____ on all payments coming from users you
                    brought to TonConsole. In return, your referrals will get a 10% discount.
                </Text> */}

                <Text textStyle="label2" mt={5} mb={2} fontSize={16}>
                    Your Referral Link
                </Text>
                <CopyPad mb={4} text={getRefferalURLURI()} paddingRight={'1'} />
                <StatsCard header="Invited Users" value={user.referralCount} width={'170px'} />
            </Flex>
        </Overlay>
    );
};

export default observer(UserProfilePage);
