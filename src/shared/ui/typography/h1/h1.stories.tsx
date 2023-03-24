import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { H1 } from 'src/shared';

const meta = {
    title: 'components/H1',
    component: H1,
    argTypes: { color: { control: { type: 'color' } } },
    controls: {}
} as ComponentMeta<typeof H1>;

const Template: ComponentStory<typeof H1> = args => <H1 {...args} />;

export default {
    ...meta,
    args: { children: 'Heading1' }
};

export const Primary = Template.bind({});
