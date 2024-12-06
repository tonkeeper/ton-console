import { FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { DownloadIcon16, DTOLiteproxyKey } from 'src/shared';
import { globalConfig } from './global.config';

const DownloadConfigButton: FC<
    ButtonProps & {
        liteproxyList: DTOLiteproxyKey[];
    }
> = ({ liteproxyList }) => {
    const ipToSignedInt32 = (ip: string): number => {
        const parts = ip.split('.').map(Number);
        if (parts.length !== 4 || parts.some(part => part < 0 || part > 255 || isNaN(part))) {
            throw new Error('Invalid IP address');
        }

        const unsignedBigInt =
            (BigInt(parts[0]) << 24n) |
            (BigInt(parts[1]) << 16n) |
            (BigInt(parts[2]) << 8n) |
            BigInt(parts[3]);

        const signedInt32 = BigInt.asIntN(32, unsignedBigInt);

        return Number(signedInt32);
    };

    const getGlobalConfig = (): typeof globalConfig => ({
        ...globalConfig,
        liteservers: liteproxyList.map(({ server, public_key }) => ({
            ip: ipToSignedInt32(server.split(':')[0]),
            port: parseInt(server.split(':')[1]),
            id: {
                '@type': 'pub.ed25519',
                key: public_key
            }
        }))
    });

    const handleDownload = () => {
        const json = JSON.stringify(getGlobalConfig(), null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'global.config.json';
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <Button leftIcon={<DownloadIcon16 />} onClick={handleDownload} variant="secondary">
            Download global.config
        </Button>
    );
};

export default DownloadConfigButton;
