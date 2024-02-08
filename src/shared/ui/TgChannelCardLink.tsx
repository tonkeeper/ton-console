import { ComponentProps, FunctionComponent } from 'react';
import { Center, Text } from '@chakra-ui/react';
import { CardLink, EXTERNAL_LINKS, TonConsoleWhiteIcon20 } from 'src/shared';

export const TgChannelCardLink: FunctionComponent<
    ComponentProps<typeof CardLink> & { size?: 'md' | 'sm' }
> = ({ size, ...props }) => {
    return (
        <CardLink
            variant="elevated"
            href={EXTERNAL_LINKS.TG_CHANNEL}
            icon={
                <Center w="32px" h="32px" bg="icon.primary" borderRadius="md">
                    <TonConsoleWhiteIcon20 />
                </Center>
            }
            {...(size === 'sm' && { pt: '10px', pb: '10px' })}
            {...props}
        >
            <Text
                textStyle="label1"
                textDecoration="none"
                {...(size === 'sm' && { lineHeight: '20px', minH: '20px' })}
            >
                Subscribe to the Telegram channel
            </Text>

            <Text
                textStyle="body2"
                color="text.secondary"
                textDecoration="none"
                {...(size === 'sm' && { lineHeight: '18px', minH: '18px' })}
            >
                Stay informed about all the news
            </Text>
        </CardLink>
    );
};
