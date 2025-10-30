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
import { FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { NftIcon24 } from 'src/shared';
import { JettonIcon24 } from 'src/shared/ui/icons/JettonIcon24';
import { useBalanceQuery } from 'src/features/balance';
import { useProject } from 'src/shared/contexts/ProjectIdContext';

const Aside: FC = () => {
    const { data: balance, isLoading } = useBalanceQuery();
    const project = useProject();

    const totalAmount = balance?.total;
    const formattedTotalAmount =
        totalAmount !== undefined
            ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
              }).format(totalAmount)
            : null;
    return (
        <DropDownMenu>
            <DropDownMenuItem linkTo="dashboard" leftIcon={<DashboardIcon />}>
                Dashboard
            </DropDownMenuItem>
            <DropDownMenuItemExpandable leftIcon={<TonapiIcon />} content="TON API" linkTo="tonapi">
                <DropDownMenuItem linkTo="api-keys">API keys</DropDownMenuItem>
                <DropDownMenuItem linkTo="webhooks">Webhooks</DropDownMenuItem>
                <DropDownMenuItem linkTo="liteservers">Liteservers</DropDownMenuItem>
                <DropDownMenuItem linkTo="pricing">Pricing</DropDownMenuItem>
            </DropDownMenuItemExpandable>
            <DropDownMenuItem linkTo="tonkeeper-messages" leftIcon={<MessageIcon24 />}>
                Tonkeeper Messages
            </DropDownMenuItem>
            {project?.capabilities.invoices ? (
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
                <DropDownMenuItem linkTo="minter">Minter</DropDownMenuItem>
                <DropDownMenuItem linkTo="airdrops">Airdrops</DropDownMenuItem>
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
                        isLoading={isLoading}
                        textStyle="body3"
                        color="text.secondary"
                        skeletonWidth="45px"
                    >
                        {formattedTotalAmount}
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

export default Aside;
