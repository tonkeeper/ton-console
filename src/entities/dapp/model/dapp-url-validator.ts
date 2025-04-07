import { ErrorOption } from 'react-hook-form';
import axios from 'axios';
import { CreateDappForm } from './interfaces';

export const fetchDappFormByManifestUrl = async (manifestUrl: string): Promise<CreateDappForm> => {
    const uint8Array = new TextEncoder().encode(manifestUrl);
    const base64ManifestUrl = btoa(String.fromCharCode(...uint8Array));
    const requestUrl = `https://c.tonapi.io/json?url=${base64ManifestUrl}`;

    const response = await axios.get(requestUrl);

    const url = response.data.url;

    if (!url || typeof url !== 'string') {
        throw new Error('Cannot parse response');
    }

    let name;
    if ('name' in response.data && response.data.name && typeof response.data.name === 'string') {
        name = response.data.name;
    }

    let image;
    if (
        'iconUrl' in response.data &&
        response.data.iconUrl &&
        typeof response.data.iconUrl === 'string'
    ) {
        image = response.data.iconUrl;
    }

    return {
        url,
        ...(name && { name }),
        ...(image && { image })
    };
};

export const dappUrlValidator = async (
    val: string
): Promise<ErrorOption | { success: true; result: CreateDappForm }> => {
    try {
        const result = await fetchDappFormByManifestUrl(val);

        return {
            success: true,
            result
        };
    } catch (e) {
        return {
            message: 'Cannot fetch manifest'
        };
    }
};
