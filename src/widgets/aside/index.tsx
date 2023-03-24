import {
    DropDownMenu,
    DropDownMenuItem,
    DropDownMenuItemExpandable,
    SettingsIcon,
    SupportIcon,
    TonapiIcon
} from 'src/shared';
import { FunctionComponent } from 'react';

export const Aside: FunctionComponent = () => {
    return (
        <DropDownMenu>
            <DropDownMenuItemExpandable leftIcon={<TonapiIcon />} content="TON API" linkTo="tonapi">
                <DropDownMenuItem linkTo="oauth">Oauth</DropDownMenuItem>
                <DropDownMenuItem linkTo="billing">Billing</DropDownMenuItem>
                <DropDownMenuItemExpandable content="API keys" linkTo="api-keys">
                    <DropDownMenuItem linkTo="prod">&quot;Prod&quot;</DropDownMenuItem>
                    <DropDownMenuItem linkTo="dev">&quot;Dev&quot;</DropDownMenuItem>
                </DropDownMenuItemExpandable>
            </DropDownMenuItemExpandable>
            <DropDownMenuItem leftIcon={<SettingsIcon />} linkTo="settings">
                Settings
            </DropDownMenuItem>
            <DropDownMenuItem leftIcon={<SupportIcon />} linkTo="support">
                Support
            </DropDownMenuItem>
        </DropDownMenu>
    );
};
