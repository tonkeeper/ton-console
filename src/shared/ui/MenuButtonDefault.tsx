import { Button, forwardRef, MenuButton } from '@chakra-ui/react';

export const MenuButtonDefault = forwardRef((props, ref) => (
    <MenuButton ref={ref} as={Button} variant="secondary" {...props} />
));
