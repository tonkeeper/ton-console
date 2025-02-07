/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ADError {
    /** @format int32 */
    code?: number;
    /** @example "Unexpected error" */
    message?: string;
}

export interface ADAirdropData {
    clam_status: ADAirdropDataClamStatusEnum;
    jetton: ADJettonInfo;
    /**
     * Admin`s wallet address
     * @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
     */
    admin: string;
    /**
     * Status of data readiness for airdrop
     * @example false
     */
    processed: boolean;
    /** royalty parameters for airdrop */
    royalty_parameters: ADRoyaltyParameters;
    /** @example "597968399" */
    total_amount?: string;
    /**
     * Total number of recipients
     * @format int32
     * @example 10000000
     */
    recipients?: number;
    /**
     * Number of distributor contracts
     * @format int32
     * @example 16
     */
    shards?: number;
    /**
     * Sha256 hash of uploaded CSV file
     * @example "97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
     */
    file_hash?: string;
    /**
     * Name of uploaded CSV file
     * @example "airdrop.csv"
     */
    file_name?: string;
    /**
     * True if the file is uploaded but not saved in the database
     * @example false
     */
    upload_in_progress?: boolean;
    /**
     * File upload error
     * @example "Address duplication error. Two identical recipient addresses in the file."
     */
    upload_error?: string;
}

/** royalty parameters for airdrop */
export interface ADRoyaltyParameters {
    /** @example "100000000" */
    min_commission: string;
}

export interface ADDistributorData {
    /**
     * Distributor contract address
     * @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
     */
    account: string;
    airdrop_status: ADDistributorDataAirdropStatusEnum;
    /**
     * Total airdrop amount
     * @example "597968399"
     */
    total_amount: string;
    /**
     * Total number of recipients
     * @format int32
     * @example 10000000
     */
    recipients: number;
    /**
     * Shard number of distributor contract
     * @format int32
     * @example 3
     */
    shard: number;
    deploy_message?: ADInternalMessage;
    top_up_message?: ADInternalMessage;
    ton_withdrawal_message?: ADInternalMessage;
    jetton_withdrawal_message?: ADInternalMessage;
    block_message?: ADInternalMessage;
    /**
     * Jettons to-up amount
     * @example "597968399"
     */
    need_jettons?: string;
    /**
     * Number of completed claims
     * @format int32
     * @example 10000000
     */
    completed_claims?: number;
    /**
     * Total claimed amount
     * @example "597968399"
     */
    claimed_amount?: string;
    /**
     * Accumulated commission (estimated, admin gets)
     * @example "597968399"
     */
    accumulated_commission?: string;
    /**
     * Jetton balance
     * @example "597968399"
     */
    jetton_balance?: string;
}

export interface ADRoyaltyData {
    /**
     * Distributor contract address
     * @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
     */
    account: string;
    /**
     * Shard number of distributor contract
     * @format int32
     * @example 3
     */
    shard: number;
    royalty_withdrawal_message?: ADInternalMessage;
    /**
     * Accumulated royalty (royalty receiver gets)
     * @default "0"
     * @example "597968399"
     */
    accumulated_royalty: string;
    /**
     * Total accumulated royalty (royalty receiver gets)
     * @default "0"
     * @example "597968399"
     */
    total_accumulated_royalty: string;
}

export interface ADInternalMessage {
    /**
     * Message sending mode
     * @format int32
     * @example 3
     */
    mode: number;
    /**
     * Destination address in user-friendly form with bounce flag
     * @example "kQABcHP_oXkYNCx3HHKd4rxL371RRl-O6IwgwqYZ7IT6Ha-u"
     */
    address: string;
    /** Message state init (base64 format) */
    state_init?: string;
    /** Message payload (base64 format) */
    payload: string;
    /**
     * TON attached amount
     * @example "597968399"
     */
    amount: string;
}

export interface ADJettonInfo {
    /**
     * @format address
     * @example "0:0BB5A9F69043EEBDDA5AD2E946EB953242BD8F603FE795D90698CEEC6BFC60A0"
     */
    address: string;
    /** @example "Wrapped TON" */
    name: string;
    /** @example "Wrapped Toncoin" */
    description?: string;
    /** @example "WTON" */
    symbol: string;
    /** @example "9" */
    decimals: string;
    /** @example "https://cache.tonapi.io/images/jetton.jpg" */
    preview: string;
}

export interface ADDistributorsData {
    /** List of distributor contracts */
    distributors: ADDistributorData[];
}

export interface ADRoyaltiesData {
    /** List of distributor`s royalty info */
    royalties: ADRoyaltyData[];
}

export interface ADConfig {
    /**
     * @format int32
     * @example 1
     */
    royalty_numerator: number;
    /**
     * @format int32
     * @example 2
     */
    royalty_denominator: number;
}

export interface ADUserClaim {
    claim_message: ADInternalMessage;
    /** @example "597968399" */
    jetton_amount: string;
    /**
     * Jetton master contract in user-friendly form
     * @example "kQABcHP_oXkYNCx3HHKd4rxL371RRl-O6IwgwqYZ7IT6Ha-u"
     */
    jetton: string;
}

export enum ADAirdropDataClamStatusEnum {
    ADOpened = 'opened',
    ADClosed = 'closed'
}

export enum ADDistributorDataAirdropStatusEnum {
    ADNotDeployed = 'not_deployed',
    ADLackOfJettons = 'lack_of_jettons',
    ADReady = 'ready',
    ADBlocked = 'blocked'
}

import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    HeadersDefaults,
    ResponseType
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
    extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
    extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
    securityWorker?: (
        securityData: SecurityDataType | null
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = 'application/json',
    FormData = 'multipart/form-data',
    UrlEncoded = 'application/x-www-form-urlencoded',
    Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({
        securityWorker,
        secure,
        format,
        ...axiosConfig
    }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({
            ...axiosConfig,
            baseURL: axiosConfig.baseURL || 'http://localhost:8888'
        });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(
        params1: AxiosRequestConfig,
        params2?: AxiosRequestConfig
    ): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method &&
                    this.instance.defaults.headers[
                        method.toLowerCase() as keyof HeadersDefaults
                    ]) ||
                    {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {})
            }
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === 'object' && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        if (input instanceof FormData) {
            return input;
        }
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }

    public request = async <T = any, _E = any>({
        secure,
        path,
        type,
        query,
        format,
        body,
        ...params
    }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams =
            ((typeof secure === 'boolean' ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
            body = JSON.stringify(body);
        }

        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path
        });
    };
}

/**
 * @title Airdrop API for TON Console
 * @version 0.0.1
 * @baseUrl http://localhost:8888
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    v1 = {
        /**
         * No description
         *
         * @tags admin
         * @name GetAirdropData
         * @summary Get airdrop info
         * @request GET:/v1/airdrop
         */
        getAirdropData: (
            query: {
                /**
                 * Airdrop ID
                 * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
                 */
                id: string;
                project_id: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<ADAirdropData, ADError>({
                path: `/v1/airdrop`,
                method: 'GET',
                query: query,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @tags admin
         * @name NewAirdrop
         * @summary Generate new airdrop
         * @request POST:/v1/airdrop
         */
        newAirdrop: (
            query: {
                project_id: string;
            },
            data: {
                /** claim admin wallet address */
                admin: string;
                /** jetton master contract address */
                jetton: string;
                /** royalty parameters for airdrop */
                royalty_parameters: ADRoyaltyParameters;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b" */
                    id: string;
                },
                ADError
            >({
                path: `/v1/airdrop`,
                method: 'POST',
                query: query,
                body: data,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @tags admin
         * @name FileUpload
         * @summary Upload withdrawals file
         * @request POST:/v1/airdrop/upload
         */
        fileUpload: (
            query: {
                /**
                 * Airdrop ID
                 * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
                 */
                id: string;
                project_id: string;
            },
            data: {
                url?: string;
                /**
                 * The CSV file to upload
                 * @format binary
                 */
                file?: File;
            },
            params: RequestParams = {}
        ) =>
            this.request<void, ADError>({
                path: `/v1/airdrop/upload`,
                method: 'POST',
                query: query,
                body: data,
                type: ContentType.FormData,
                ...params
            }),

        /**
         * No description
         *
         * @tags admin
         * @name GetDistributorsData
         * @summary Get distributors info
         * @request GET:/v1/airdrop/distributors
         */
        getDistributorsData: (
            query: {
                /**
                 * Airdrop ID
                 * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
                 */
                id: string;
                project_id: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<ADDistributorsData, ADError>({
                path: `/v1/airdrop/distributors`,
                method: 'GET',
                query: query,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @tags admin
         * @name GetRoyaltyData
         * @summary Get royalty info
         * @request GET:/v1/airdrop/royalty
         */
        getRoyaltyData: (
            query: {
                /**
                 * Airdrop ID
                 * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
                 */
                id: string;
                project_id: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<ADRoyaltiesData, ADError>({
                path: `/v1/airdrop/royalty`,
                method: 'GET',
                query: query,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @tags admin
         * @name GetConfig
         * @summary Get config params
         * @request GET:/v1/config
         */
        getConfig: (
          query: {
            project_id: string;
            },
          params: RequestParams = {}
        ) =>
            this.request<ADConfig, ADError>({
                path: `/v1/config`,
                method: 'GET',
                query: query,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @tags admin
         * @name OpenClaim
         * @summary Open claim method for users
         * @request POST:/v1/airdrop/start
         */
        openClaim: (
            query: {
                /**
                 * Airdrop ID
                 * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
                 */
                id: string;
                project_id: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<void, ADError>({
                path: `/v1/airdrop/start`,
                method: 'POST',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags admin
         * @name CloseClaim
         * @summary Close claim method for users
         * @request POST:/v1/airdrop/stop
         */
        closeClaim: (
            query: {
                /**
                 * Airdrop ID
                 * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
                 */
                id: string;
                project_id: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<void, ADError>({
                path: `/v1/airdrop/stop`,
                method: 'POST',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags claim
         * @name GetUserClaim
         * @summary Get user claim data
         * @request GET:/v1/airdrop/claim/{account}
         */
        getUserClaim: (
            account: string,
            query: {
                /**
                 * Airdrop ID
                 * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
                 */
                id: string;
                project_id: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<ADUserClaim, ADError>({
                path: `/v1/airdrop/claim/${account}`,
                method: 'GET',
                query: query,
                format: 'json',
                ...params
            })
    };
}
