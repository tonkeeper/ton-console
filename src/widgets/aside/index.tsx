import {
    BalanceIcon24,
    DropDownMenu,
    DropDownMenuItem,
    DropDownMenuItemExpandable,
    SettingsIcon,
    SupportIcon,
    TonapiIcon
} from 'src/shared';
import { FunctionComponent } from 'react';
import { Flex, Text } from '@chakra-ui/react';

export const Aside: FunctionComponent = () => {
    return (
        <DropDownMenu>
            <DropDownMenuItemExpandable leftIcon={<TonapiIcon />} content="TON API" linkTo="tonapi">
                <DropDownMenuItem linkTo="api-keys">Api keys and calls</DropDownMenuItem>
                <DropDownMenuItem linkTo="documentation">Documentation</DropDownMenuItem>
                <DropDownMenuItem linkTo="pricing">Pricing</DropDownMenuItem>
            </DropDownMenuItemExpandable>
            <DropDownMenuItem leftIcon={<BalanceIcon24 />} linkTo="balance">
                <Flex direction="column">
                    <Text textStyle="label2" color="text.primary">
                        Balance
                    </Text>
                    <Text textStyle="body3" color="text.secondary">
                        180 TON
                    </Text>
                </Flex>
            </DropDownMenuItem>
            <DropDownMenuItem leftIcon={<SettingsIcon />} linkTo="settings">
                Settings
            </DropDownMenuItem>
            <DropDownMenuItem leftIcon={<SupportIcon />} linkTo="support">
                Support
            </DropDownMenuItem>
        </DropDownMenu>
    );
};
