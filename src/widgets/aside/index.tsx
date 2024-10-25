import {
    BalanceIcon24,
    CoinsIcon24,
    DashboardIcon,
    DropDownMenu,
    DropDownMenuItem,
    DropDownMenuItemExpandable,
    InvoicesIcon24,
    MessageIcon24,
    SettingsIcon,
    StatsIcon24,
    TextWithSkeleton,
    TonapiIcon
} from 'src/shared';
import { FunctionComponent } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { balanceStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { invoicesAppStore } from 'src/features';
import { NftIcon24 } from 'src/shared';
import { JettonIcon24 } from 'src/shared/ui/icons/JettonIcon24';

const Aside: FunctionComponent = () => {
    return (
        <DropDownMenu>
            <DropDownMenuItem linkTo="dashboard" leftIcon={<DashboardIcon />}>
                Dashboard
            </DropDownMenuItem>
            <DropDownMenuItemExpandable leftIcon={<TonapiIcon />} content="TON API" linkTo="tonapi">
                <DropDownMenuItem linkTo="api-keys">API keys</DropDownMenuItem>
                <DropDownMenuItem linkTo="webhooks">Webhooks</DropDownMenuItem>
                <DropDownMenuItem linkTo="pricing">Pricing</DropDownMenuItem>
            </DropDownMenuItemExpandable>
            <DropDownMenuItem linkTo="tonkeeper-messages" leftIcon={<MessageIcon24 />}>
                Tonkeeper Messages
            </DropDownMenuItem>
            {invoicesAppStore.invoicesApp$.value ? (
                <DropDownMenuItemExpandable
                    leftIcon={<InvoicesIcon24 />}
                    content="Payment Tracker"
                    linkTo="invoices"
                >
                    <DropDownMenuItem linkTo="manage">Manage</DropDownMenuItem>
                    <DropDownMenuItem linkTo="dashboard">Overview</DropDownMenuItem>
                </DropDownMenuItemExpandable>
            ) : (
                <DropDownMenuItem linkTo="invoices" leftIcon={<InvoicesIcon24 />}>
                    Payment Tracker
                </DropDownMenuItem>
            )}
            <DropDownMenuItemExpandable
                leftIcon={<StatsIcon24 />}
                content="TON Analytics"
                linkTo="analytics"
            >
                {/*{projectsStore.selectedProject?.capabilities.stats.query && (
                    <DropDownMenuItem linkTo="dashboard">Dashboard</DropDownMenuItem>
                )}*/}
                <DropDownMenuItem linkTo="history">History</DropDownMenuItem>
                <DropDownMenuItem linkTo="query">Query</DropDownMenuItem>
                <DropDownMenuItem linkTo="graph">Graph</DropDownMenuItem>
            </DropDownMenuItemExpandable>
            <DropDownMenuItemExpandable leftIcon={<NftIcon24 />} content="NFT" linkTo="nft">
                <DropDownMenuItem linkTo="cnft">cNFT</DropDownMenuItem>
            </DropDownMenuItemExpandable>
            <DropDownMenuItemExpandable
                leftIcon={<JettonIcon24 />}
                content="Jetton"
                linkTo="jetton"
            >
                <DropDownMenuItem linkTo="../jetton">Minter</DropDownMenuItem>
            </DropDownMenuItemExpandable>
            <DropDownMenuItem linkTo="faucet" leftIcon={<CoinsIcon24 />}>
                Testnet Assets
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
