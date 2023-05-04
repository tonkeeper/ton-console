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

export interface DTOOk {
    /** @example true */
    ok: boolean;
}

export interface DTOError {
    /** Error message */
    error: string;
    /** backend error code */
    code: DTOErrorCode;
}

export interface DTOUser {
    /**
     * @format int64
     * @example "1464363297"
     */
    id: number;
    /**
     * ID from the Telegram service
     * @format int64
     * @example "1260831881"
     */
    tg_id?: number;
    /**
     * TON wallet address
     * @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
     */
    wallet_address?: string;
    /** @example "Test" */
    first_name?: string;
    /** @example "Testov" */
    last_name?: string;
    /** @example "https://test.io/my_face.png" */
    avatar?: string;
    /**
     * @default false
     * @example false
     */
    is_ban: boolean;
    /** Authorization token */
    token?: string;
    /**
     * @format int64
     * @example 1678275313
     */
    date_create: number;
}

export interface DTOTier {
    /**
     * @format int64
     * @example 1
     */
    id: number;
    /** @example "Test tier" */
    name: string;
    /** @example 5 */
    long_polling_sub: number;
    /** @example 5 */
    entity_per_conn: number;
    capabilities: string[];
    /** @example 5 */
    rpc: number;
    /** @example 100 */
    usd_price: number;
}

export interface DTOAppTier {
    /**
     * @format int64
     * @example 1
     */
    id: number;
    /** @example "Test tier" */
    name: string;
    /** @example 5 */
    rpc: number;
    /** @example 100 */
    usd_price: number;
    /** @example 50 */
    long_polling_sub: number;
    /** @example 10 */
    entity_per_conn: number;
    capabilities: string[];
    /** @example "2023-04-23" */
    next_payment?: string;
    /** @example "2023-03-23" */
    date_create: string;
}

export interface DTODeposit {
    /** @example "0QB7BSerVyP9xAKnxp3QpqR8JO2HKwZhl10zsfwg7aJ281ZR" */
    deposit_address: string;
    /** @example "0QB7BSerVyP9xAKnxp3QpqR8JO2HKwZhl10zsfwg7aJ281ZR" */
    source_address: string;
    /** @example "2023-03-23" */
    income_date: string;
    /**
     * @format int64
     * @example 1000000000
     */
    amount: number;
}

export interface DTOCharge {
    /** @example "742af494-e2cd-441f-98e8-ac6075280eff" */
    id: string;
    /**
     * @format int64
     * @example 1
     */
    tier_id?: number;
    /**
     * @format int64
     * @example 1
     */
    messages_package_id?: number;
    /**
     * @format int64
     * @example 1000000000
     */
    amount: number;
    /** @example 2.25 */
    exchange_rate: number;
    /** @example "2023-03-23" */
    date_create: string;
}

export interface DTOBalance {
    /** @example "TON" */
    currency: string;
    /**
     * @format int64
     * @example 1000000000
     */
    balance: number;
}

export interface DTOProject {
    /**
     * @format int64
     * @example 1
     */
    id: number;
    /** @example "Test project" */
    name: string;
    /** @example "https://tonapi.io/static/test.png" */
    avatar?: string;
    /** @example "2023-03-23" */
    date_create: string;
}

export interface DTOToken {
    /**
     * @format int64
     * @example 1
     */
    id: number;
    /** @example "My token" */
    name: string;
    /** @example 5 */
    limit_rps?: number;
    /** @example "AE5TZRWIIOR2O2YAAAAGFP2HEWFZJYBP222A567CBF6JIL7S4RIZSCOAZRZOEW7AKMRICGQ" */
    token: string;
    /** @example "2023-03-23" */
    date_create: string;
}

export interface DTOStats {
    result: {
        metric: {
            /** @example "DnsResolve" */
            operation?: string;
        };
        values: any[];
    }[];
    /** @example "matrix" */
    resultType: string;
}

export interface DTOMessagesPackage {
    /**
     * @format int64
     * @example 1
     */
    id: number;
    /** @example "Lite" */
    name: string;
    /** @example 1000 */
    limits: number;
    /** @example 100 */
    usd_price: number;
}

export interface DTOMessagesApp {
    /**
     * @format int64
     * @example 3652012454
     */
    id: number;
    /** @example "MyApp-123" */
    name: string;
    /** @example "https://my_dapp.io/avatar.png" */
    image?: string;
    /** @example 1647024163 */
    project_id: number;
    /** @example "https://my_dapp.io" */
    url: string;
    /** @example true */
    verify: boolean;
    /** @example "2023-03-23" */
    date_create: string;
}

/** backend error code */
export enum DTOErrorCode {
    DTOErrorUnknown = 1,
    DTOErrorInternal = 2,
    DTOErrorBadRequest = 3,
    DTOErrorCheckPayload = 4,
    DTOErrorVerificationProof = 5,
    DTOErrorVerificationTg = 6,
    DTOErrorAuthUser = 7,
    DTOErrorBannedUser = 8,
    DTOErrorLogoutUser = 9,
    DTOErrorCreateProject = 10,
    DTOErrorGetProject = 11,
    DTOErrorUpdateProject = 12,
    DTOErrorDeleteProject = 13,
    DTOErrorProjectWithoutTier = 14,
    DTOErrorUpdateTier = 15,
    DTOErrorGetTiers = 16,
    DTOErrorAlreadySelectedTier = 17,
    DTOErrorDownGradeTier = 18,
    DTOErrorInsufficientFunds = 19
}

import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    HeadersDefaults,
    ResponseType
} from 'axios';

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
 * @title REST API to TON Console
 * @version 0.0.1
 * @baseUrl http://localhost:8888
 * @contact Support <contact@tonaps.org>
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    api = {
        /**
         * @description The token is recorded in the database and in the user's cookies.  If the user logs in under different browsers, then each authorization will have its own token.
         *
         * @tags auth
         * @name AuthViaTg
         * @summary Auth via telegram
         * @request POST:/api/v1/auth/tg
         */
        authViaTg: (
            data: {
                /**
                 * @format int64
                 * @example 1261871881
                 */
                id: number;
                /** @example "Test" */
                first_name?: string;
                /** @example "Testov" */
                photo_url?: string;
                /** @example "testov" */
                username?: string;
                /** @example "cd0e201bf7328535343301f428e51f01084a3e2a3822f4843d86b540bbebfe15" */
                hash: string;
                /**
                 * @format int64
                 * @example 1678275313
                 */
                auth_date: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/auth/tg`,
                method: 'POST',
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthGeneratePayload
         * @summary Generate payload for TON Connect
         * @request POST:/api/v1/auth/ton-proof/generate_payload
         */
        authGeneratePayload: (params: RequestParams = {}) =>
            this.request<
                {
                    /** @example "84jHVNLQmZsAAAAAZB0Zryi2wqVJI-KaKNXOvCijEi46YyYzkaSHyJrMPBMOkVZa" */
                    payload: string;
                },
                DTOError
            >({
                path: `/api/v1/auth/ton-proof/generate_payload`,
                method: 'POST',
                ...params
            }),

        /**
         * @description The token is recorded in the database and in the user's cookies.  If the user logs in under different browsers, then each authorization will have its own token.
         *
         * @tags auth
         * @name AuthViaTonConnect
         * @summary Auth via TON Connect
         * @request POST:/api/v1/auth/ton-proof/check_proof
         */
        authViaTonConnect: (
            data: {
                /** @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b" */
                address: string;
                proof: {
                    /**
                     * @format int64
                     * @example "1678275313"
                     */
                    timestamp?: number;
                    domain?: {
                        /** @format uint32 */
                        length_bytes?: number;
                        value?: string;
                    };
                    signature?: string;
                    /** @example "84jHVNLQmZsAAAAAZB0Zryi2wqVJI-KaKNXOvCijEi46YyYzkaSHyJrMPBMOkVZa" */
                    payload?: string;
                    state_init?: string;
                };
            },
            params: RequestParams = {}
        ) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/auth/ton-proof/check_proof`,
                method: 'POST',
                body: data,
                ...params
            }),

        /**
         * @description After logout, the user's token is deleted
         *
         * @tags account
         * @name AccountLogout
         * @summary Logout from the system
         * @request POST:/api/v1/account/logout
         * @secure
         */
        accountLogout: (params: RequestParams = {}) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/account/logout`,
                method: 'POST',
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name CreateProject
         * @summary Create project
         * @request POST:/api/v1/project
         * @secure
         */
        createProject: (
            data: {
                /** @example "Test Project" */
                name: string;
                /** @format binary */
                image?: File;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    project: DTOProject;
                },
                DTOError
            >({
                path: `/api/v1/project`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.FormData,
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name GetProjects
         * @summary Get user's project
         * @request GET:/api/v1/projects
         * @secure
         */
        getProjects: (params: RequestParams = {}) =>
            this.request<
                {
                    items: DTOProject[];
                },
                DTOError
            >({
                path: `/api/v1/projects`,
                method: 'GET',
                secure: true,
                ...params
            }),

        /**
         * @description You need to pass only those fields that need to be changed.
         *
         * @tags project
         * @name UpdateProject
         * @summary Update user project
         * @request PATCH:/api/v1/project/{id}
         * @secure
         */
        updateProject: (
            id: number,
            data: {
                /** @example "Test Project" */
                name?: string;
                /**
                 * If you want to delete a avatar, put null in the image field.
                 * @format binary
                 */
                image?: File | null;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    project: DTOProject;
                },
                DTOError
            >({
                path: `/api/v1/project/${id}`,
                method: 'PATCH',
                body: data,
                secure: true,
                type: ContentType.FormData,
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name DeleteProject
         * @summary Delete user project
         * @request DELETE:/api/v1/project/{id}
         * @secure
         */
        deleteProject: (id: number, params: RequestParams = {}) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/project/${id}`,
                method: 'DELETE',
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name GetDepositAddress
         * @summary Get project deposit address
         * @request GET:/api/v1/project/{id}/deposit/address
         * @secure
         */
        getDepositAddress: (id: number, params: RequestParams = {}) =>
            this.request<
                {
                    /** @example "0QB7BSerVyP9xAKnxp3QpqR8JO2HKwZhl10zsfwg7aJ281ZR" */
                    ton_deposit_wallet: string;
                },
                DTOError
            >({
                path: `/api/v1/project/${id}/deposit/address`,
                method: 'GET',
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name GetProjectDepositsHistory
         * @summary Get project deposits history
         * @request GET:/api/v1/project/{id}/deposits/history
         * @secure
         */
        getProjectDepositsHistory: (id: number, params: RequestParams = {}) =>
            this.request<
                {
                    balance: DTOBalance;
                    history: DTODeposit[];
                },
                DTOError
            >({
                path: `/api/v1/project/${id}/deposits/history`,
                method: 'GET',
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GetTonApiTokens
         * @summary Get TonAPI tokens
         * @request GET:/api/v1/services/tonapi/tokens
         * @secure
         */
        getTonApiTokens: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    items: DTOToken[];
                },
                DTOError
            >({
                path: `/api/v1/services/tonapi/tokens`,
                method: 'GET',
                query: query,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GenerateTonApiProjectToken
         * @summary Generate TonAPI project token
         * @request POST:/api/v1/services/tonapi/generate/token
         * @secure
         */
        generateTonApiProjectToken: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            data: {
                /** @example "My token" */
                name: string;
                /** @example 5 */
                limit_rps?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    token: DTOToken;
                },
                DTOError
            >({
                path: `/api/v1/services/tonapi/generate/token`,
                method: 'POST',
                query: query,
                body: data,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name UpdateTonApiProjectToken
         * @summary Update TonAPI project token
         * @request PATCH:/api/v1/services/tonapi/token/{id}
         * @secure
         */
        updateTonApiProjectToken: (
            id: number,
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            data: {
                /** @example "My token" */
                name: string;
                /** @example 5 */
                limit_rps?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/services/tonapi/token/${id}`,
                method: 'PATCH',
                query: query,
                body: data,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name DeleteTonApiProjectToken
         * @summary Delete TonAPI project token
         * @request DELETE:/api/v1/services/tonapi/token/{id}
         * @secure
         */
        deleteTonApiProjectToken: (
            id: number,
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/services/tonapi/token/${id}`,
                method: 'DELETE',
                query: query,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GetTonApiProjectTier
         * @summary Get project TonAPI tier
         * @request GET:/api/v1/services/tonapi/tier
         * @secure
         */
        getTonApiProjectTier: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    tier: DTOAppTier;
                },
                DTOError
            >({
                path: `/api/v1/services/tonapi/tier`,
                method: 'GET',
                query: query,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name UpdateTonApiTier
         * @summary Update TonAPI tier for project
         * @request PATCH:/api/v1/services/tonapi/tier
         * @secure
         */
        updateTonApiTier: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            data: {
                /**
                 * @format int64
                 * @example 1
                 */
                tier_id?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    tier: DTOAppTier;
                },
                DTOError
            >({
                path: `/api/v1/services/tonapi/tier`,
                method: 'PATCH',
                query: query,
                body: data,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GetTonApiTiers
         * @summary Get active TonAPI tiers
         * @request GET:/api/v1/services/tonapi/tiers
         * @secure
         */
        getTonApiTiers: (params: RequestParams = {}) =>
            this.request<
                {
                    items: DTOTier[];
                },
                DTOError
            >({
                path: `/api/v1/services/tonapi/tiers`,
                method: 'GET',
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GetTonApiPaymentsHistory
         * @summary Get TonAPI payments history
         * @request GET:/api/v1/services/tonapi/payments/history
         * @secure
         */
        getTonApiPaymentsHistory: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    history: DTOCharge[];
                },
                DTOError
            >({
                path: `/api/v1/services/tonapi/payments/history`,
                method: 'GET',
                query: query,
                secure: true,
                ...params
            }),

        /**
         * @description To filter the stats, are expected  start and end query parameters in unix format, where end is the day closer to the current one, for example start=1675958400&end=1676908800,
         *
         * @tags tonapi_service
         * @name GetTonApiTokensStats
         * @summary Get TonAPI stats by tokens
         * @request GET:/api/v1/services/tonapi/stats
         * @secure
         */
        getTonApiTokensStats: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
                /**
                 * Start date
                 * @format int64
                 */
                start: number;
                /**
                 * End date
                 * @format int64
                 */
                end: number;
                /**
                 * Step
                 * @format int64
                 */
                step?: number;
                /**
                 * Show more detailed information
                 * @example true
                 */
                detailed?: boolean;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    stats: DTOStats;
                },
                DTOError
            >({
                path: `/api/v1/services/tonapi/stats`,
                method: 'GET',
                query: query,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetMessagesPackages
         * @summary Get messages packages
         * @request GET:/api/v1/services/messages/packages
         * @secure
         */
        getMessagesPackages: (params: RequestParams = {}) =>
            this.request<
                {
                    items: DTOMessagesPackage[];
                },
                DTOError
            >({
                path: `/api/v1/services/messages/packages`,
                method: 'GET',
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name BuyMessagesPackage
         * @summary Buy messages package
         * @request POST:/api/v1/services/messages/package
         * @secure
         */
        buyMessagesPackage: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            data: {
                /**
                 * @format int64
                 * @example 1
                 */
                id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/services/messages/package`,
                method: 'POST',
                query: query,
                body: data,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetPushesPaymentsHistory
         * @summary Get messages payments history
         * @request GET:/api/v1/services/messages/payments/history
         * @secure
         */
        getPushesPaymentsHistory: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    history: DTOCharge[];
                },
                DTOError
            >({
                path: `/api/v1/services/messages/payments/history`,
                method: 'GET',
                query: query,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name CreateMessagesApp
         * @summary Create messages app
         * @request POST:/api/v1/services/messages/app
         * @secure
         */
        createMessagesApp: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            data: {
                /** @example "https://my_dapp.io" */
                url: string;
                /** @example "My dapp" */
                name?: string;
                /** @example "https://my_dapp.io/avatar.png" */
                image?: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @example "DkPazejgbwoAAAAAZFNueLGu-1GCWVgvk5Av_1EK2Ml5LzQItlrivLPtTPMsu5A2" */
                    payload: string;
                    /**
                     * @format int64
                     * @example 1683189368
                     */
                    valid_until: number;
                },
                DTOError
            >({
                path: `/api/v1/services/messages/app`,
                method: 'POST',
                query: query,
                body: data,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name VerifyMessagesApp
         * @summary Verify messages app
         * @request POST:/api/v1/services/messages/app/verify
         * @secure
         */
        verifyMessagesApp: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            data: {
                /** @example "DkPazejgbwoAAAAAZFNueLGu-1GCWVgvk5Av_1EK2Ml5LzQItlrivLPtTPMsu5A2" */
                payload: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/services/messages/app/verify`,
                method: 'POST',
                query: query,
                body: data,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetMessagesApps
         * @summary Get messages apps
         * @request GET:/api/v1/services/messages/apps
         * @secure
         */
        getMessagesApps: (
            query: {
                /**
                 * Project ID
                 * @format int64
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    items: DTOMessagesApp[];
                },
                DTOError
            >({
                path: `/api/v1/services/messages/apps`,
                method: 'GET',
                query: query,
                secure: true,
                ...params
            })
    };
}
