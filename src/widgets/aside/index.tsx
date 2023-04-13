import {
    BalanceIcon24,
    DropDownMenu,
    DropDownMenuItem,
    DropDownMenuItemExpandable,
    SettingsIcon,
    TonapiIcon
} from 'src/shared';
import { FunctionComponent } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { balanceStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const Aside: FunctionComponent = () => {
    return (
        <DropDownMenu>
            <DropDownMenuItemExpandable leftIcon={<TonapiIcon />} content="TON API" linkTo="tonapi">
                <DropDownMenuItem linkTo="api-keys">Api keys and calls</DropDownMenuItem>
                <DropDownMenuItem linkTo="pricing">Pricing</DropDownMenuItem>
            </DropDownMenuItemExpandable>
            <DropDownMenuItem leftIcon={<BalanceIcon24 />} linkTo="balance">
                <Flex direction="column">
                    <Text textStyle="label2" color="text.primary">
                        Balance
                    </Text>
                    {balanceStore.balances[0] && (
                        <Text textStyle="body3" color="text.secondary">
                            {balanceStore.balances[0].stringCurrencyAmount}
                        </Text>
                    )}
                </Flex>
            </DropDownMenuItem>
            <DropDownMenuItemExpandable
                leftIcon={<SettingsIcon />}
                content="Settings"
                linkTo="settings"
            >
                <DropDownMenuItem linkTo="edit-project" pb="0">
                    Edit project
                </DropDownMenuItem>
            </DropDownMenuItemExpandable>
        </DropDownMenu>
    );
};

export default observer(Aside);
