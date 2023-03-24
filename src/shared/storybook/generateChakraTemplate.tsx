/* eslint-disable import/no-extraneous-dependencies */

import React, { ComponentClass, FunctionComponent } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import theme from 'src/app/providers/with-chakra/theme';
import { getThemingArgTypes } from '@chakra-ui/storybook-addon';
import { defineStyleConfig } from '@chakra-ui/styled-system';

export function generateChakraTemplate(
    Component: ComponentClass | FunctionComponent,
    stylesConfig: ReturnType<typeof defineStyleConfig>,
    name?: string
): { Template: ComponentStory<typeof Component>; meta: ComponentMeta<typeof Component> } {
    const componentName = name || Component.displayName!;
    const componentTheme = {
        ...theme,
        components: {
            ...theme.components,
            [componentName]: stylesConfig
        }
    } as Parameters<typeof getThemingArgTypes>[0];

    const meta = {
        title: `components/${componentName}`,
        component: Component,
        argTypes: {
            ...getThemingArgTypes(componentTheme, componentName)
        }
    } as ComponentMeta<typeof Component>;

    const Template: ComponentStory<typeof Component> = args => <Component {...args} />;

    return {
        Template,
        meta
    };
}
