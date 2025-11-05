import { FC, PropsWithChildren } from 'react';
import { Skeleton, Text, TextProps, useTheme } from '@chakra-ui/react';
import { subtractPixels } from 'src/shared';

const TextWithSkeleton: FC<
    PropsWithChildren<
        { isLoading: boolean; skeletonWidth: string | number } & (
            | { textStyle: string }
            | { lineHeight: string | number }
            | { height: string | number }
            | { h: string | number }
        ) &
            TextProps
    >
> = ({ isLoading, skeletonWidth, children, ...rest }) => {
    const theme = useTheme();
    const textStyleHeight =
        rest.textStyle && typeof rest.textStyle === 'string'
            ? theme.textStyles[rest.textStyle]?.lineHeight
            : undefined;

    let height = rest.lineHeight || rest.height || rest.h || textStyleHeight || '14px';
    if (typeof height === 'string' && height.endsWith('px')) {
        height = subtractPixels(height, '4');
    } else {
        height = Number(height) - 1;
    }

    if (isLoading) {
        return <Skeleton w={skeletonWidth} h={height} my="0.5" />;
    }

    return <Text {...rest}>{children}</Text>;
};

export default TextWithSkeleton;
