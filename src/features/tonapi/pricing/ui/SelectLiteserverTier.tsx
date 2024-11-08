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
    TickIcon,
    UsdCurrencyAmount,
    DTOLiteproxyTier
} from 'src/shared';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';

const SelectLiteserverTierItem = observer<{
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

interface SelectLiteserverTierProps extends BoxProps {
    onSelectTier: (tier: DTOLiteproxyTier) => void;
    tiers: DTOLiteproxyTier[];
    selectedTier: DTOLiteproxyTier;
    currentTier: DTOLiteproxyTier;
}

export const SelectLiteserverTier: FC<SelectLiteserverTierProps> = observer(
    ({ onSelectTier, tiers, currentTier, selectedTier, ...props }) => {
        return (
            <Box {...props}>
                <Menu placement="bottom">
                    <MenuButtonDefault w="316px" rightIcon={<ArrowIcon />}>
                        <HStack ml={2}>
                            <Text textStyle="label2" noOfLines={1}>
                                {selectedTier.name}
                            </Text>
                        </HStack>
                    </MenuButtonDefault>
                    <MenuList zIndex={100} w="316px">
                        {tiers.map(tier => (
                            <SelectLiteserverTierItem
                                key={tier.id}
                                name={tier.name}
                                amount={new UsdCurrencyAmount(tier.usd_price).stringCurrencyAmount}
                                onSelect={() => onSelectTier(tier)}
                                isCurrent={tier.id === currentTier.id}
                            />
                        ))}
                    </MenuList>
                </Menu>
            </Box>
        );
    }
);
