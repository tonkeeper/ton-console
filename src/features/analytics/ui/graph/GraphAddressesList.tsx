import { ComponentProps, FC } from 'react';
import { ListItem, OrderedList } from '@chakra-ui/react';
import { TonAddress } from 'src/shared';

export const GraphAddressesList: FC<
    ComponentProps<typeof OrderedList> & { addresses: TonAddress[] }
> = ({ addresses, ...props }) => {
    return (
        <OrderedList
            sx={{
                counterReset: 'item',
                listStyleType: 'none',
                'li:before': {
                    content: 'counter(item) "  "',
                    counterIncrement: 'item',
                    display: 'inline-block',
                    width: '28px'
                }
            }}
            textStyle="body2"
            overflow="auto"
            color="text.secondary"
            fontFamily="mono"
            stylePosition="inside"
            {...props}
        >
            {addresses.map(address => (
                <ListItem key={address.userFriendly} display="block">
                    {address.userFriendly}
                </ListItem>
            ))}
        </OrderedList>
    );
};
