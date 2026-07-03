import {
  Address,
  Cell,
  Dictionary,
  type StateInit,
  beginCell,
  contractAddress,
  storeStateInit,
  toNano,
} from "@ton/core"
import type { SendTransactionRequest } from "@tonconnect/ui-react"
import { Buffer } from "buffer"

import minterCompiled from "./contracts/jetton-minter.compiled.json"
import walletCompiled from "./contracts/jetton-wallet.compiled.json"

const ONCHAIN_CONTENT_PREFIX = 0x00
const OFFCHAIN_CONTENT_PREFIX = 0x01
const SNAKE_PREFIX = 0x00
const SNAKE_CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8)

const JETTON_MINT_OP = 21
const JETTON_INTERNAL_TRANSFER_OP = 0x178d4519

export const JETTON_DEPLOY_GAS = toNano("0.25")
export const JETTON_INITIAL_MINT_GAS = toNano("0.2")
export const DEFAULT_JETTON_DECIMALS = 9

const jettonWalletCode = CellFromHex(walletCompiled.hex)
const jettonMinterCode = CellFromHex(minterCompiled.hex)

export type JettonMetadata = {
  name?: string
  symbol?: string
  description?: string
  image?: string
  decimals?: string
  uri?: string
}

export type JettonDeployParams = {
  owner: Address
  amountToMint: bigint
  onchainMetaData?: JettonMetadata
  offchainUri?: string
  queryId?: bigint
}

export type JettonPreparedDeploy = {
  address: Address
  request: SendTransactionRequest
  stateInit: string
  payload: string
}

type DeployDetails = {
  value: bigint
  code: Cell
  data: Cell
  message: Cell
}

function CellFromHex(hex: string) {
  return Cell.fromBoc(Buffer.from(hex, "hex"))[0]
}

function bufferToChunks(buffer: Buffer, chunkSize: number) {
  const chunks: Buffer[] = []
  let cursor = buffer

  while (cursor.byteLength > 0) {
    chunks.push(cursor.subarray(0, chunkSize))
    cursor = cursor.subarray(chunkSize)
  }

  return chunks
}

function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, SNAKE_CELL_MAX_SIZE_BYTES)
  const [firstChunk, ...tailChunks] = chunks

  let tailBuilder = beginCell()
  for (let index = tailChunks.length - 1; index >= 0; index -= 1) {
    tailBuilder.storeBuffer(tailChunks[index])

    if (index !== 0) {
      tailBuilder = beginCell().storeRef(tailBuilder)
    }
  }

  const rootBuilder = beginCell().storeUint(SNAKE_PREFIX, 8)
  if (firstChunk) {
    rootBuilder.storeBuffer(firstChunk)
  }
  if (tailChunks.length > 0) {
    rootBuilder.storeRef(tailBuilder)
  }

  return rootBuilder.endCell()
}

async function metadataKey(key: string) {
  const data = new TextEncoder().encode(key)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return BigInt(`0x${Buffer.from(new Uint8Array(hash)).toString("hex")}`)
}

async function buildJettonOnchainMetadata(data: JettonMetadata): Promise<Cell> {
  const dict = Dictionary.empty(
    Dictionary.Keys.BigUint(256),
    Dictionary.Values.Cell()
  )

  for (const [key, value] of Object.entries(data)) {
    if (!value) {
      continue
    }

    if (
      !["name", "symbol", "description", "image", "decimals", "uri"].includes(
        key
      )
    ) {
      throw new Error(`Unsupported on-chain metadata key: ${key}`)
    }

    dict.set(await metadataKey(key), makeSnakeCell(Buffer.from(value, "utf8")))
  }

  return beginCell()
    .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
    .storeDict(dict)
    .endCell()
}

function buildJettonOffchainMetadata(contentUri: string): Cell {
  return beginCell()
    .storeUint(OFFCHAIN_CONTENT_PREFIX, 8)
    .storeBuffer(Buffer.from(contentUri, "ascii"))
    .endCell()
}

async function initJettonData({
  owner,
  onchainMetaData,
  offchainUri,
}: Pick<JettonDeployParams, "owner" | "onchainMetaData" | "offchainUri">) {
  if (!onchainMetaData && !offchainUri) {
    throw new Error("Add metadata fields or provide an uploaded metadata URL.")
  }

  const metadata = offchainUri
    ? buildJettonOffchainMetadata(offchainUri)
    : await buildJettonOnchainMetadata(onchainMetaData ?? {})

  return beginCell()
    .storeCoins(0)
    .storeAddress(owner)
    .storeRef(metadata)
    .storeRef(jettonWalletCode)
    .endCell()
}

function buildMintBody(
  owner: Address,
  jettonValue: bigint,
  coinsForFee: bigint,
  queryId: bigint
): Cell {
  return beginCell()
    .storeUint(JETTON_MINT_OP, 32)
    .storeUint(queryId, 64)
    .storeAddress(owner)
    .storeCoins(coinsForFee)
    .storeRef(
      beginCell()
        .storeUint(JETTON_INTERNAL_TRANSFER_OP, 32)
        .storeUint(0, 64)
        .storeCoins(jettonValue)
        .storeAddress(null)
        .storeAddress(owner)
        .storeCoins(toNano("0.001"))
        .storeBit(false)
        .endCell()
    )
    .endCell()
}

async function createDeployDetails(
  params: JettonDeployParams
): Promise<DeployDetails> {
  return {
    code: jettonMinterCode,
    data: await initJettonData(params),
    message: buildMintBody(
      params.owner,
      params.amountToMint,
      JETTON_INITIAL_MINT_GAS,
      params.queryId ?? 0n
    ),
    value: JETTON_DEPLOY_GAS,
  }
}

export function fromDecimals(src: string, decimals: number): bigint {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error("Decimals must be an integer from 0 to 255.")
  }

  if (!/^\d+(\.\d+)?$/.test(src.trim())) {
    throw new Error("Mint amount must be a positive number.")
  }

  const [whole = "0", fraction = ""] = src.trim().split(".")
  if (fraction.length > decimals) {
    throw new Error(`Mint amount supports up to ${decimals} decimal places.`)
  }

  const paddedFraction = fraction.padEnd(decimals, "0")
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(paddedFraction || "0")
}

export async function prepareJettonDeploy(
  params: JettonDeployParams
): Promise<JettonPreparedDeploy> {
  const deployDetails = await createDeployDetails(params)
  const stateInit: StateInit = {
    code: deployDetails.code,
    data: deployDetails.data,
  }
  const address = contractAddress(0, stateInit)
  const stateInitBuilder = beginCell()
  storeStateInit(stateInit)(stateInitBuilder)

  const stateInitBoc = stateInitBuilder.endCell().toBoc().toString("base64")
  const payloadBoc = deployDetails.message.toBoc().toString("base64")

  return {
    address,
    stateInit: stateInitBoc,
    payload: payloadBoc,
    request: {
      validUntil: Math.floor(Date.now() / 1000) + 5 * 60,
      messages: [
        {
          address: address.toString(),
          amount: deployDetails.value.toString(),
          stateInit: stateInitBoc,
          payload: payloadBoc,
        },
      ],
    },
  }
}
