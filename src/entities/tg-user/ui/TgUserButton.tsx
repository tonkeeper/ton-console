import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { tGUserStore } from 'src/entities';
import {
    Button,
    HStack,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useBreakpointValue
} from '@chakra-ui/react';
import { ArrowIcon, DisconnectIcon, MenuButtonStyled, TgIcon } from 'src/shared';

export const TgUserButton: FunctionComponent = observer(() => {
    const buttonText = useBreakpointValue({
        base: 'Connect',
        md: 'Connect Telegram'
    });

    if (tGUserStore.user$.value) {
        return (
            <Menu placement="bottom">
                <MenuButton as={MenuButtonStyled} maxW="200px" rightIcon={<ArrowIcon />}>
                    <HStack spacing="2">
                        {tGUserStore.user$.value.imageUrl && (
                            <Image
                                w="7"
                                h="7"
                                borderRadius="100"
                                src={tGUserStore.user$.value.imageUrl}
                            />
                        )}
                        <Text textStyle="label2" noOfLines={1}>
                            {tGUserStore.user$.value.firstName} {tGUserStore.user$.value.lastName}
                        </Text>
                    </HStack>
                </MenuButton>
                <MenuList w="200px">
                    <MenuItem onClick={tGUserStore.logout}>
                        <DisconnectIcon mr="2" />
                        <Text textStyle="label2">Disconnect</Text>
                    </MenuItem>
                </MenuList>
            </Menu>
        );
    } else {
        return (
            <Button
                isLoading={tGUserStore.user$.isLoading}
                leftIcon={<TgIcon />}
                onClick={tGUserStore.login}
                variant="secondary"
            >
                {buttonText}
            </Button>
        );
    }
});
