import { FC, PropsWithChildren, ReactElement } from 'react';
import {
    Box,
    BoxProps,
    Card,
    CardBody,
    CardFooter,
    Flex,
    Image,
    ImageProps,
    Text,
    chakra
} from '@chakra-ui/react';
import type * as CSS from 'csstype';

export const FeatureCard: FC<
    PropsWithChildren<
        BoxProps & {
            background: CSS.Property.Color;
            fallback?: ReactElement;
            src: string;
            heading: string;
            description: string;
            imgBorder?: boolean;
            imgHeight: ImageProps['height'];
            imgSources?: { media: string; srcSet: string }[];
        }
    >
> = ({
    imgBorder,
    imgSources,
    imgHeight,
    background,
    fallback,
    heading,
    description,
    src,
    children,
    ...rest
}) => {
    return (
        <Card
            overflow="hidden"
            borderRadius="lg"
            bgColor="background.contentTint"
            size="xl"
            {...rest}
        >
            <CardBody h="274px" minH="274px" maxH="274px" px="10px" pb="0" bg={background}>
                <chakra.picture h="100%" alignItems="center" justifyContent="center" display="flex">
                    {imgSources?.map(item => (
                        <source key={item.media} media={item.media} srcSet={item.srcSet} />
                    ))}
                    <Image
                        h={imgHeight}
                        px={imgBorder ? '1' : '0'}
                        objectFit="contain"
                        bgColor={imgBorder ? 'rgba(255, 255, 255, 0.24)' : 'transparent'}
                        draggable="false"
                        fallback={fallback || <></>}
                        src={src}
                    />
                </chakra.picture>
            </CardBody>
            <CardFooter flexDir="column" flex="1" pt="5">
                <Box textStyle="label1">{heading}</Box>
                <Text textStyle="body1" mb="4" color="text.secondary">
                    {description}
                </Text>
                <Flex gap="3" mt="auto">
                    {children}
                </Flex>
            </CardFooter>
        </Card>
    );
};
