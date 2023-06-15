import { forwardRef, MenuButton } from '@chakra-ui/react';
import { IconButton } from './IconButton';

export const MenuButtonIcon = forwardRef((props, ref) => (
    <MenuButton ref={ref} as={IconButton} {...props} />
));
