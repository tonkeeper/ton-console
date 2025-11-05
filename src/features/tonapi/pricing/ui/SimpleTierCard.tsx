import { FC, useState } from 'react';
import { Button, Card, CardProps, Flex, Text, Badge } from '@chakra-ui/react';
import { H2 } from 'src/shared';

interface SimpleTierCardProps extends CardProps {
    name: string;
    price: string;
    rps: string | number;
    priceDescription?: string;
    isCurrent?: boolean;
    isDisabled?: boolean;
    onSelect?: () => void;
    buttonText?: string;
    buttonVariant?: string;
}

export const SimpleTierCard: FC<SimpleTierCardProps> = ({
    name,
    price,
    rps,
    priceDescription,
    isCurrent = false,
    isDisabled = false,
    onSelect,
    buttonText = 'Choose',
    buttonVariant,
    ...rest
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            pos="relative"
            direction="column"
            p="2"
            opacity={isDisabled ? 0.6 : 1}
            border={isCurrent ? '2px solid' : '1px solid'}
            borderColor={isCurrent ? 'text.secondary' : 'gray.200'}
            transition="all 0.2s"
            onMouseEnter={() => !isDisabled && setIsHovered(true)}
            onMouseLeave={() => !isDisabled && setIsHovered(false)}
            size="xl"
            {...rest}
        >
            {isCurrent && (
                <Badge
                    pos="absolute"
                    right="0"
                    bottom="0"
                    px="3"
                    py="1"
                    color="white"
                    fontSize="xs"
                    bg="text.secondary"
                    borderTopRightRadius="0"
                    borderTopLeftRadius="md"
                    borderBottomLeftRadius="0"
                    borderBottomRightRadius="0"
                >
                    Current
                </Badge>
            )}

            <Flex justify="space-between" gap="4">
                <Flex direction="column" flex="1">
                    <Text textStyle="label2" color="text.secondary">
                        {name}
                    </Text>
                    <H2 fontSize={24}>{price}</H2>
                    {priceDescription && (
                        <Text textStyle="body2" color="text.secondary">
                            {priceDescription}
                        </Text>
                    )}
                </Flex>

                <Flex justify="center">
                    {isHovered && onSelect && !isDisabled ? (
                        <Button
                            alignSelf="center"
                            onClick={onSelect}
                            size="lg"
                            variant={buttonVariant}
                        >
                            {buttonText}
                        </Button>
                    ) : (
                        <Flex align="flex-end" direction="column">
                            <Text textStyle="label2" color="text.secondary">
                                RPS
                            </Text>
                            <H2 fontSize={24}>{rps}</H2>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Card>
    );
};
