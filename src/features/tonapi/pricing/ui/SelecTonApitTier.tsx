import {
    Menu,
    MenuItem,
    MenuList,
    Text,
    HStack,
    Box,
    BoxProps,
    Flex,
    Icon
} from '@chakra-ui/react';
import {
    ArrowIcon,
    MenuButtonDefault,
    TooltipHoverable,
    Span,
    useIsTextTruncated,
    TickIcon
} from 'src/shared';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { TonApiTier } from '../model';
import { tonApiTiersStore } from 'src/shared/stores';

const SelectTonApiTierItem = observer<{
    name: string;
    amount?: string;
    onSelect: () => void;
    isCurrent?: boolean;
}>(({ name, amount, onSelect, isCurrent = false }) => {
    const { ref, isTruncated } = useIsTextTruncated();
    return (
        <TooltipHoverable
            placement="right"
            canBeShown={isTruncated}
            host={
                <MenuItem onClick={() => onSelect()}>
                    <Flex justify="flex-start" gap={1} w="100%">
                        <Span
                            ref={ref}
                            textStyle="label2"
                            color="text.primary"
                            layerStyle="textEllipse"
                            whiteSpace="nowrap"
                        >
                            {name}
                        </Span>
                        {amount && (
                            <Text textStyle="label2" color="text.secondary">
                                · {amount}
                            </Text>
                        )}
                        {isCurrent && <Icon as={TickIcon} ml="auto" color="accent.green" />}
                    </Flex>
                </MenuItem>
            }
        >
            {name}
        </TooltipHoverable>
    );
});

interface SelectTonApiTierProps extends BoxProps {
    onSelectTier: (value: TonApiTier | 'custom') => void;
    currentTier: TonApiTier | 'custom';
}

export const SelectTonApiTier: FC<SelectTonApiTierProps> = observer(
    ({ onSelectTier, currentTier, ...props }) => {
        const chosedTier = tonApiTiersStore.selectedTier$.value;

        if (!chosedTier) {
            return null;
        }

        return (
            <Box {...props}>
                <Menu placement="bottom">
                    <MenuButtonDefault w="316px" rightIcon={<ArrowIcon />}>
                        <HStack ml={2}>
                            <Text textStyle="label2" noOfLines={1}>
                                {currentTier === 'custom' ? 'Custom' : currentTier.name}
                            </Text>
                        </HStack>
                    </MenuButtonDefault>
                    <MenuList zIndex={100} w="316px">
                        {tonApiTiersStore.tiers$.value.map(tier => (
                            <SelectTonApiTierItem
                                key={tier.id}
                                name={tier.name}
                                amount={tier.price.stringCurrencyAmount}
                                onSelect={() => onSelectTier(tier)}
                                isCurrent={tier.id === chosedTier.id}
                            />
                        ))}
                        <SelectTonApiTierItem
                            name="Custom"
                            onSelect={() => onSelectTier('custom')}
                        />
                    </MenuList>
                </Menu>
            </Box>
        );
    }
);
