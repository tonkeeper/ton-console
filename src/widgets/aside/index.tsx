import {
    BalanceIcon24,
    DashboardIcon,
    DropDownMenu,
    DropDownMenuItem,
    DropDownMenuItemExpandable,
    MessageIcon24,
    SettingsIcon,
    TextWithSkeleton,
    TonapiIcon
} from 'src/shared';
import { FunctionComponent } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { balanceStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { invoicesStore } from 'src/features';

const Aside: FunctionComponent = () => {
    return (
        <DropDownMenu>
            <DropDownMenuItem linkTo="dashboard" leftIcon={<DashboardIcon />}>
                Dashboard
            </DropDownMenuItem>
            {invoicesStore.invoicesApp$.value ? (
                <DropDownMenuItemExpandable
                    leftIcon={<TonapiIcon />}
                    content="Invoices"
                    linkTo="invoices"
                >
                    <DropDownMenuItem linkTo="manage">Manage</DropDownMenuItem>
                    <DropDownMenuItem linkTo="api-description">Api Description</DropDownMenuItem>
                </DropDownMenuItemExpandable>
            ) : (
                <DropDownMenuItem linkTo="invoices" leftIcon={<DashboardIcon />}>
                    Invoices
                </DropDownMenuItem>
            )}
            <DropDownMenuItemExpandable leftIcon={<TonapiIcon />} content="TON API" linkTo="tonapi">
                <DropDownMenuItem linkTo="api-keys">Api keys and calls</DropDownMenuItem>
                <DropDownMenuItem linkTo="pricing">Pricing</DropDownMenuItem>
            </DropDownMenuItemExpandable>
            <DropDownMenuItem linkTo="tonkeeper-messages" leftIcon={<MessageIcon24 />}>
                Tonkeeper Messages
            </DropDownMenuItem>
            <DropDownMenuItem leftIcon={<BalanceIcon24 />} linkTo="balance">
                <Flex direction="column">
                    <Text textStyle="label2" color="text.primary">
                        Balance
                    </Text>
                    <TextWithSkeleton
                        isLoading={!balanceStore.portfolio$.isResolved}
                        textStyle="body3"
                        color="text.secondary"
                        skeletonWidth="45px"
                    >
                        {balanceStore.balances[0]?.stringCurrencyAmount}
                    </TextWithSkeleton>
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
