import { FC, PropsWithChildren } from 'react';
import { IconProps, PopoverProps } from '@chakra-ui/react';
import { TooltipHoverable } from './TooltipHoverable';
import { InfoIcon16 } from '../icons';

export const InfoTooltip: FC<PropsWithChildren<IconProps & Pick<PopoverProps, 'placement'>>> = ({
    children,
    placement,
    ...rest
}) => {
    return (
        <TooltipHoverable canBeShown placement={placement || 'top'} host={<InfoIcon16 {...rest} />}>
            {children}
        </TooltipHoverable>
    );
};
