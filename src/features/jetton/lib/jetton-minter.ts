import { Cell, beginCell, Address, toNano, Dictionary } from '@ton/core';

import walletHex from './contracts/jetton-wallet.compiled.json';
import minterHex from './contracts/jetton-minter.compiled.json';

const ONCHAIN_CONTENT_PREFIX = 0x00;
const OFFCHAIN_CONTENT_PREFIX = 0x01;
const SNAKE_PREFIX = 0x00;

const SNAKE_CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8); // 126 bytes

export const JETTON_WALLET_CODE = Cell.fromBoc(Buffer.from(walletHex.hex, 'hex'))[0];
export const JETTON_MINTER_CODE = Cell.fromBoc(Buffer.from(minterHex.hex, 'hex'))[0]; // code cell from build output

enum OPS {
    CHANGE_ADMIN = 3,
    REPLACE_METADATA = 4,
    MINT = 21,
    INTERNAL_TRANSFER = 0x178d4519,
    TRANSFER = 0xf8a7ea5,
    BURN = 0x595f07bc
}

export type JettonMetadata = {
    name?: string;
    description?: string;
    image?: string;
    symbol?: string;
    image_data?: string;
    decimals?: string;
    uri?: string;
};

const jettonOnChainMetadataSpec: Map<keyof JettonMetadata, 'utf8' | 'ascii' | undefined> = new Map([
    ['name', 'utf8'],
    ['description', 'utf8'],
    ['image', 'ascii'],
    ['symbol', 'utf8'],
    ['image_data', undefined],
    ['decimals', 'utf8'],
    ['uri', 'ascii']
]);

const sha256 = async (str: string): Promise<Buffer> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    return Buffer.from(new Uint8Array(hashBuffer));
};

function bufferToChunks(buff: Buffer, chunkSize: number) {
    const chunks: Buffer[] = [];
    while (buff.byteLength > 0) {
        chunks.push(buff.subarray(0, chunkSize));
        buff = buff.subarray(chunkSize);
    }
    return chunks;
}

export function makeSnakeCell(data: Buffer): Cell {
    const chunks = bufferToChunks(data, SNAKE_CELL_MAX_SIZE_BYTES);

    const [firstChunk, ...tailChunks] = chunks;

    const secondChunk = tailChunks[0];
    const tailBuilder =
        tailChunks.length !== 0 &&
        tailChunks.toReversed().reduce((prevBuilder, chunk) => {
            prevBuilder.storeBuffer(chunk);
            return secondChunk === chunk ? prevBuilder : beginCell().storeRef(prevBuilder);
        }, beginCell());

    const rootBuilder = beginCell().storeUint(SNAKE_PREFIX, 8);
    if (firstChunk) {
        rootBuilder.storeBuffer(firstChunk);
    }
    if (tailBuilder) {
        rootBuilder.storeRef(tailBuilder);
    }

    return rootBuilder.endCell();
}

// export function flattenSnakeCell(cell: Cell): Buffer {
//     const sliceToBuffer = (c: Cell, v: Buffer, isFirst: boolean): Buffer => {
//         const s = c.beginParse();

//         if (isFirst && s.loadUint(8) !== SNAKE_PREFIX)
//             throw new Error('Only snake format is supported');

//         if (s.remainingBits === 0) return v;

//         const data = s.loadBuffer(s.remainingBits / 8);
//         v = Buffer.concat([v, data]);

//         const newCell = s.remainingRefs > 0 ? s.loadRef() : null;
//         s.endParse();

//         return newCell ? sliceToBuffer(newCell, v, false) : v;
//     };

//     const buffer = sliceToBuffer(cell, Buffer.from(''), true);

//     return buffer;
// }

async function toDictKey(key: string): Promise<bigint> {
    const shaKey = await sha256(key);
    return BigInt(`0x${shaKey.toString('hex')}`);
}

export async function buildJettonOnchainMetadata(data: JettonMetadata): Promise<Cell> {
    const dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());

    await Promise.all(
        Object.entries(data).map(async ([k, v]: [string, string | undefined]) => {
            const key = k as keyof JettonMetadata;

            if (!jettonOnChainMetadataSpec.get(key)) {
                throw new Error(`Unsupported onchain key: ${k}`);
            }

            if (v === undefined || v === '') return;

            const bufferToStore = Buffer.from(v, jettonOnChainMetadataSpec.get(key));

            const dictKey = await toDictKey(k);
            dict.set(dictKey, makeSnakeCell(bufferToStore));
        })
    );

    return beginCell().storeUint(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell();
}

export function buildJettonOffChainMetadata(contentUri: string): Cell {
    return beginCell()
        .storeInt(OFFCHAIN_CONTENT_PREFIX, 8)
        .storeBuffer(Buffer.from(contentUri, 'ascii'))
        .endCell();
}

export type PersistenceType = 'onchain' | 'offchain_private_domain' | 'offchain_ipfs';

// export async function readJettonMetadata(contentCell: Cell): Promise<{
//     persistenceType: PersistenceType;
//     metadata: { [s in JettonMetaDataKeys]?: string };
//     isJettonDeployerFaultyOnChainData?: boolean;
// }> {
//     const contentSlice = contentCell.beginParse();
//     const prefix = contentSlice.loadInt(8);

//     switch (prefix) {
//         case ONCHAIN_CONTENT_PREFIX: {
//             const res = await parseJettonOnchainMetadata(contentSlice);

//             let persistenceType: PersistenceType = 'onchain';

//             if (res.metadata.uri) {
//                 const offchainMetadata = await getJettonMetadataFromExternalUri(res.metadata.uri);
//                 persistenceType = offchainMetadata.isIpfs
//                     ? 'offchain_ipfs'
//                     : 'offchain_private_domain';
//                 res.metadata = {
//                     ...res.metadata,
//                     ...offchainMetadata.metadata
//                 };
//             }

//             return {
//                 persistenceType: persistenceType,
//                 ...res
//             };
//         }
//         case OFFCHAIN_CONTENT_PREFIX: {
//             const { metadata, isIpfs } = await parseJettonOffchainMetadata(contentSlice);
//             return {
//                 persistenceType: isIpfs ? 'offchain_ipfs' : 'offchain_private_domain',
//                 metadata
//             };
//         }
//         default:
//             throw new Error('Unexpected jetton metadata content prefix');
//     }
// }

// async function parseJettonOffchainMetadata(contentSlice: Slice): Promise<{
//     metadata: { [s in JettonMetaDataKeys]?: string };
//     isIpfs: boolean;
// }> {
//     return getJettonMetadataFromExternalUri(contentSlice.loadStringTail());
// }

// async function getJettonMetadataFromExternalUri(uri: string) {
//     const jsonURI = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');

//     return {
//         metadata: (await axios.get(jsonURI)).data,
//         isIpfs: /(^|\/)ipfs[.:]/.test(jsonURI)
//     };
// }

// async function parseJettonOnchainMetadata(contentSlice: Slice): Promise<{
//     metadata: {
//         [s in JettonMetaDataKeys]?: string;
//     };
//     isJettonDeployerFaultyOnChainData: boolean;
// }> {
//     let isJettonDeployerFaultyOnChainData = false; // TODO: check if this is used

//     const dict = contentSlice.loadDict(Dictionary.Keys.BigUint(256), {
//         serialize(_src: Buffer, _builder: Builder) {
//             return;
//         },
//         parse: (src: Slice): Buffer => {
//             if (src.remainingRefs === 0) {
//                 isJettonDeployerFaultyOnChainData = true;
//                 return flattenSnakeCell(src.asCell());
//             }
//             return flattenSnakeCell(src.loadRef());
//         }
//     });

//     const res = Object.fromEntries(
//         await Promise.all(
//             Array.from(jettonOnChainMetadataSpec).map(async ([k, v]) => {
//                 const dictKey = await toDictKey(k);
//                 const val = dict.get(dictKey)?.toString(v);
//                 return [k, val];
//             })
//         )
//     );

//     return {
//         metadata: res,
//         isJettonDeployerFaultyOnChainData
//     };
// }

export async function initData(owner: Address, data?: JettonMetadata, offchainUri?: string) {
    if (!data && !offchainUri) {
        throw new Error('Must either specify onchain data or offchain uri');
    }

    const metadata = offchainUri
        ? buildJettonOffChainMetadata(offchainUri)
        : await buildJettonOnchainMetadata(data!);

    return beginCell()
        .storeCoins(0)
        .storeAddress(owner)
        .storeRef(metadata)
        .storeRef(JETTON_WALLET_CODE)
        .endCell();
}

export function mintBody(
    owner: Address,
    jettonValue: bigint,
    coinsForFee: bigint,
    queryId: bigint
): Cell {
    return beginCell()
        .storeUint(OPS.MINT, 32)
        .storeUint(queryId, 64) // queryid
        .storeAddress(owner)
        .storeCoins(coinsForFee)
        .storeRef(
            // internal transfer message
            beginCell()
                .storeUint(OPS.INTERNAL_TRANSFER, 32)
                .storeUint(0, 64)
                .storeCoins(jettonValue)
                .storeAddress(null)
                .storeAddress(owner)
                .storeCoins(toNano(0.001))
                .storeBit(false) // forward_payload in this slice, not separate cell
                .endCell()
        )
        .endCell();
}

export function burnBody(amount: bigint, responseAddress: Address) {
    return beginCell()
        .storeUint(OPS.BURN, 32) // action
        .storeUint(1, 64) // query-id
        .storeCoins(amount)
        .storeAddress(responseAddress)
        .storeDict(null)
        .endCell();
}

export function transfer(to: Address, from: Address, jettonAmount: bigint) {
    return beginCell()
        .storeUint(OPS.TRANSFER, 32)
        .storeUint(1, 64)
        .storeCoins(jettonAmount)
        .storeAddress(to)
        .storeAddress(from)
        .storeBit(false)
        .storeCoins(toNano(0.001))
        .storeBit(false) // forward_payload in this slice, not separate cell
        .endCell();
}

export function changeAdminBody(newAdmin: Address): Cell {
    return beginCell()
        .storeUint(OPS.CHANGE_ADMIN, 32)
        .storeUint(0, 64) // queryid
        .storeAddress(newAdmin)
        .endCell();
}

export function updateMetadataBody(metadata: Cell): Cell {
    return beginCell()
        .storeUint(OPS.REPLACE_METADATA, 32)
        .storeUint(0, 64) // queryid
        .storeRef(metadata)
        .endCell();
}
