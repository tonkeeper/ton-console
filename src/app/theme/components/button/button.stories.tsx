import { Button } from '@chakra-ui/react';
import buttonConfig from './index';
import { generateChakraTemplate } from 'src/shared/storybook/generateChakraTemplate';

const { Template, meta } = generateChakraTemplate(Button, buttonConfig);

export default {
    ...meta,
    args: { children: 'Button' }
};

export const Primary = Template.bind({});
