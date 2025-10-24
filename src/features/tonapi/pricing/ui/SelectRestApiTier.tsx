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
import { RestApiTier } from '../model';
import { restApiTiersStore } from 'src/shared/stores';

const SelectRestApiTierItem = observer<{
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

interface SelectRestApiTierProps extends BoxProps {
    onSelectTier: (value: RestApiTier | 'custom') => void;
    currentTier: RestApiTier | 'custom';
}

export const SelectRestApiTier: FC<SelectRestApiTierProps> = observer(
    ({ onSelectTier, currentTier, ...props }) => {
        const chosedTier = restApiTiersStore.selectedTier$.value;

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
                        {restApiTiersStore.tiers$.value.map(tier => (
                            <SelectRestApiTierItem
                                key={tier.id}
                                name={tier.name}
                                amount={tier.price.stringCurrencyAmount}
                                onSelect={() => onSelectTier(tier)}
                                isCurrent={tier.id === chosedTier.id}
                            />
                        ))}
                        <SelectRestApiTierItem
                            name="Custom"
                            onSelect={() => onSelectTier('custom')}
                        />
                    </MenuList>
                </Menu>
            </Box>
        );
    }
);
