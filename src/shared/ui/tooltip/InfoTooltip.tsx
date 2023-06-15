import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react';
import { Icon, Popover } from '@chakra-ui/react';
import { TooltipHoverable } from './TooltipHoverable';
import { InfoIcon16 } from '../icons';

export const InfoTooltip: FunctionComponent<
    PropsWithChildren<
        ComponentProps<typeof Icon> & Pick<ComponentProps<typeof Popover>, 'placement'>
    >
> = ({ children, placement, ...rest }) => {
    return (
        <TooltipHoverable canBeShown placement={placement || 'top'} host={<InfoIcon16 {...rest} />}>
            {children}
        </TooltipHoverable>
    );
};
