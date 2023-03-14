import {
    DashboardIcon,
    DropDownMenu,
    DropDownMenuItem,
    DropDownMenuItemExpandable,
    SettingsIcon,
    SubscriptionsIcon,
    SupportIcon,
    TonapiIcon
} from 'src/shared';
import { FunctionComponent } from 'react';

export const Aside: FunctionComponent = () => {
    return (
        <DropDownMenu>
            <DropDownMenuItem leftIcon={<DashboardIcon />}>Dashboard</DropDownMenuItem>
            <DropDownMenuItemExpandable leftIcon={<TonapiIcon />} content="TON API">
                <DropDownMenuItem>Oauth</DropDownMenuItem>
                <DropDownMenuItem>Billing</DropDownMenuItem>
                <DropDownMenuItemExpandable content="API keys">
                    <DropDownMenuItem>&quot;Prod&quot;</DropDownMenuItem>
                    <DropDownMenuItem>&quot;Dev&quot;</DropDownMenuItem>
                </DropDownMenuItemExpandable>
            </DropDownMenuItemExpandable>
            <DropDownMenuItem leftIcon={<SubscriptionsIcon />}>Subscriptions</DropDownMenuItem>
            <DropDownMenuItem leftIcon={<SettingsIcon />}>Settings</DropDownMenuItem>
            <DropDownMenuItem leftIcon={<SupportIcon />}>Support</DropDownMenuItem>
        </DropDownMenu>
    );
};
