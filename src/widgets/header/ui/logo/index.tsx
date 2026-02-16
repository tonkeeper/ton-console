import { FC } from 'react';
import { HStack, StackProps, Hide } from '@chakra-ui/react';
import { H4, TonConsoleIcon } from 'src/shared';
import { Link } from 'react-router-dom';

interface LogoProps extends StackProps {
    /** Always show text regardless of breakpoint */
    showText?: boolean;
}

export const Logo: FC<LogoProps> = ({ showText, ...props }) => {
    return (
        <HStack as={Link} spacing="2" to="/" {...props}>
            <TonConsoleIcon />
            {showText ? (
                <H4 cursor="pointer">Ton Console</H4>
            ) : (
                <Hide below="tablet">
                    <H4 cursor="pointer">Ton Console</H4>
                </Hide>
            )}
        </HStack>
    );
};
