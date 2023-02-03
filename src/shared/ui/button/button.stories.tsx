import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './index';

export default {
    title: 'Button',
    component: Button
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    text: 'ButtonText'
};

export const Secondary = Template.bind({});

Secondary.args = {
    text: 'ButtonTextSecondary'
};
