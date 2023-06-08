import { Button, forwardRef, MenuButton } from '@chakra-ui/react';

export const MenuButtonDefault = forwardRef((props, ref) => (
    <MenuButton ref={ref} as={Button} pr="3" pl="2" variant="secondary" {...props} />
));
