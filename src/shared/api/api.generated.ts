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
     * @format uint32
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
     * @format uint32
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
    /**
     * @format int64
     * @example 1690889913000
     */
    next_payment?: number;
    /**
     * @format int64
     * @example 1690889913000
     */
    date_create: number;
}

export interface DTODeposit {
    type: DTODepositType;
    /** @example "0QB7BSerVyP9xAKnxp3QpqR8JO2HKwZhl10zsfwg7aJ281ZR" */
    deposit_address?: string;
    /** @example "0QB7BSerVyP9xAKnxp3QpqR8JO2HKwZhl10zsfwg7aJ281ZR" */
    source_address?: string;
    /**
     * @format int64
     * @example 1690889913000
     */
    income_date: number;
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
     * @format uint32
     * @example 1
     */
    tier_id?: number;
    /**
     * @format uint32
     * @example 1
     */
    messages_package_id?: number;
    /**
     * @format uint32
     * @example 1
     */
    testnet_price_multiplicator?: number;
    /**
     * @format float64
     * @example 7.8
     */
    stats_spent_time?: number;
    /**
     * @format uint32
     * @example 1000000
     */
    stats_price_per_second?: number;
    stats_type_query?: DTOChargeStatsTypeQuery;
    /**
     * @format int64
     * @example 1000000000
     */
    amount: number;
    /** @example 2.25 */
    exchange_rate: number;
    /**
     * @format int64
     * @example 1690889913000
     */
    date_create: number;
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
     * @format uint32
     * @example 1
     */
    id: number;
    /** @example "Test project" */
    name: string;
    /** @example "https://tonapi.io/static/test.png" */
    avatar?: string;
    capabilities: DTOProjectCapabilities[];
    /**
     * @format int64
     * @example 1690889913000
     */
    date_create: number;
}

export interface DTOProjectTonApiToken {
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
    /**
     * @format int64
     * @example 1690889913000
     */
    date_create: number;
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
     * @format uint32
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
     * @format uint32
     * @example 3652012454
     */
    id: number;
    /** @example "MyApp-123" */
    name: string;
    /** @example "https://my_dapp.io/avatar.png" */
    image?: string;
    /**
     * @format uint32
     * @example 1647024163
     */
    project_id: number;
    /** @example "https://my_dapp.io" */
    url: string;
    /** @example true */
    verify: boolean;
    /**
     * @format int64
     * @example 1690889913000
     */
    date_create: number;
}

export enum DTOStatsQueryStatus {
    DTOExecuting = 'executing',
    DTOSuccess = 'success',
    DTOError = 'error'
}

export interface DTOStatsQuery {
    addresses?: string[];
    /** @example false */
    only_between?: boolean;
    /** @example "select id from accounts limit 1" */
    sql?: string;
    /**
     * cyclic execution of requests
     * @format int32
     * @example 10
     */
    repeat_interval?: number;
}

export interface DTOStatsQueryResult {
    /** @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b" */
    id: string;
    status: DTOStatsQueryStatus;
    query?: DTOStatsQuery;
    type?: DTOStatsQueryResultType;
    estimate?: DTOStatsEstimateQuery;
    /** @example "https://sql.io/123.csv" */
    url?: string;
    /** @example "https://sql.io/123_meta.csv" */
    meta_url?: string;
    /**
     * @format int64
     * @example 100
     */
    spent_time?: number;
    /**
     * @format int64
     * @example 1000000000
     */
    cost?: number;
    /** @example "invalid something" */
    error?: string;
    all_data_in_preview?: boolean;
    preview?: string[][];
    /**
     * @format int64
     * @example 1690889913000
     */
    date_create: number;
}

export interface DTOStatsEstimateQuery {
    /** @format int64 */
    approximate_time: number;
    /** @format int64 */
    approximate_cost: number;
}

export interface DTOInvoicesInvoice {
    /** @example "60ffb075" */
    id: string;
    /** @example "1000000000" */
    amount: string;
    /** @example "1000000000" */
    overpayment?: string;
    /** @example "Test description" */
    description: string;
    status: DTOInvoiceStatus;
    /** @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b" */
    pay_to_address: string;
    /** @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b" */
    paid_by_address?: string;
    /** @example "https://app.tonkeeper.com/transfer/UQ....UQ" */
    payment_link: string;
    /**
     * @format int64
     * @example 1690889913000
     */
    date_change: number;
    /**
     * @format int64
     * @example 1690889913000
     */
    date_expire: number;
    /**
     * @format int64
     * @example 1690889913000
     */
    date_create: number;
}

export interface DTOInvoicesApp {
    /**
     * @format int64
     * @example 4177275498
     */
    id: number;
    /**
     * @format int64
     * @example 4268870487
     */
    project_id: number;
    /** @example "Test name" */
    name: string;
    /** @example "Test description" */
    description: string;
    /** @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b" */
    recipient_address: string;
    webhooks?: DTOInvoicesAppWebhooks;
    /**
     * @format int64
     * @example 1690889913000
     */
    date_create: number;
}

/** @example "pending" */
export enum DTOInvoiceStatus {
    DTOPending = 'pending',
    DTOPaid = 'paid',
    DTOCancelled = 'cancelled',
    DTOExpired = 'expired'
}

export type DTOInvoicesAppWebhooks = {
    id: string;
    /** @example "https://mydapp.com/api/handle-invoice-change" */
    webhook: string;
}[];

/** backend error code */
export enum DTOErrorCode {
    DTOValue1 = 1,
    DTOValue2 = 2,
    DTOValue3 = 3
}

export enum DTODepositType {
    DTOPromoCode = 'promo_code',
    DTODeposit = 'deposit'
}

export enum DTOChargeStatsTypeQuery {
    DTOGraph = 'graph',
    DTOBaseQuery = 'base_query'
}

export enum DTOProjectCapabilities {
    DTOInvoices = 'invoices',
    DTOStats = 'stats'
}

export enum DTOStatsQueryResultType {
    DTOGraph = 'graph',
    DTOBaseQuery = 'base_query'
}

/**
 * Field
 * @example "id"
 */
export enum DTOGetInvoicesParamsFieldOrder {
    DTOId = 'id',
    DTOAmount = 'amount',
    DTOStatus = 'status',
    DTOLifeTime = 'life_time',
    DTODescription = 'description',
    DTOPayToAddress = 'pay_to_address',
    DTOPaidByAddress = 'paid_by_address',
    DTODateCreate = 'date_create',
    DTODatePaid = 'date_paid'
}

/**
 * Type order
 * @example "desc"
 */
export enum DTOGetInvoicesParamsTypeOrder {
    DTOAsc = 'asc',
    DTODesc = 'desc'
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
    ready = {
        /**
         * No description
         *
         * @tags system
         * @name PingReadyGet
         * @request GET:/ready
         */
        pingReadyGet: (params: RequestParams = {}) =>
            this.request<
                void,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/ready`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags system
         * @name PingReadyHead
         * @request HEAD:/ready
         */
        pingReadyHead: (params: RequestParams = {}) =>
            this.request<
                void,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/ready`,
                method: 'HEAD',
                ...params
            })
    };
    alive = {
        /**
         * No description
         *
         * @tags system
         * @name PingAliveGet
         * @request GET:/alive
         */
        pingAliveGet: (params: RequestParams = {}) =>
            this.request<
                void,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/alive`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags system
         * @name PingAliveHead
         * @request HEAD:/alive
         */
        pingAliveHead: (params: RequestParams = {}) =>
            this.request<
                void,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/alive`,
                method: 'HEAD',
                ...params
            })
    };
    api = {
        /**
         * No description
         *
         * @tags admin
         * @name AdminGetProjectBalance
         * @summary Private method: Get project balance
         * @request GET:/api/v1/admin/project/{id}/balance
         */
        adminGetProjectBalance: (id: number, params: RequestParams = {}) =>
            this.request<
                {
                    /**
                     * @format int64
                     * @example 1000000000
                     */
                    balance: number;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/admin/project/${id}/balance`,
                method: 'GET',
                ...params
            }),

        /**
         * @description Private method
         *
         * @tags admin
         * @name AdminChargeProject
         * @summary Private method: Charge project
         * @request POST:/api/v1/admin/project/{id}/charge
         */
        adminChargeProject: (
            id: number,
            data: {
                /**
                 * @format int64
                 * @example 1000000000
                 */
                amount: number;
                /** @example "" */
                type_of_charge: string;
                /** @example {"first_key":"1","second_key":2} */
                info: any;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/admin/project/${id}/charge`,
                method: 'POST',
                body: data,
                ...params
            }),

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
                /** @example "Test" */
                last_name?: string;
                /** @example "https://test_image.png" */
                photo_url?: string;
                /** @example "test" */
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
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/auth/tg`,
                method: 'POST',
                body: data,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthGeneratePayload
         * @summary Generate payload for TON Connect
         * @request POST:/api/v1/auth/proof/payload
         */
        authGeneratePayload: (params: RequestParams = {}) =>
            this.request<
                {
                    /** @example "84jHVNLQmZsAAAAAZB0Zryi2wqVJI-KaKNXOvCijEi46YyYzkaSHyJrMPBMOkVZa" */
                    payload: string;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/auth/proof/payload`,
                method: 'POST',
                ...params
            }),

        /**
         * @description The token is recorded in the database and in the user's cookies.  If the user logs in under different browsers, then each authorization will have its own token.
         *
         * @tags auth
         * @name AuthViaTonConnect
         * @summary Auth via TON Connect
         * @request POST:/api/v1/auth/proof/check
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
                    domain?: string;
                    signature?: string;
                    /** @example "84jHVNLQmZsAAAAAZB0Zryi2wqVJI-KaKNXOvCijEi46YyYzkaSHyJrMPBMOkVZa" */
                    payload?: string;
                    state_init?: string;
                };
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/auth/proof/check`,
                method: 'POST',
                body: data,
                format: 'json',
                ...params
            }),

        /**
         * @description After logout, the user's token is deleted
         *
         * @tags account
         * @name AccountLogout
         * @summary Logout from the system
         * @request POST:/api/v1/account/logout
         */
        accountLogout: (params: RequestParams = {}) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/account/logout`,
                method: 'POST',
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name CreateProject
         * @summary Create project
         * @request POST:/api/v1/project
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
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/project`,
                method: 'POST',
                body: data,
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
         */
        getProjects: (params: RequestParams = {}) =>
            this.request<
                {
                    items: DTOProject[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/projects`,
                method: 'GET',
                ...params
            }),

        /**
         * @description You need to pass only those fields that need to be changed.
         *
         * @tags project
         * @name UpdateProject
         * @summary Update user project
         * @request PATCH:/api/v1/project/{id}
         */
        updateProject: (
            id: number,
            data: {
                /** @example "Test Project" */
                name?: string;
                /** @format binary */
                image?: File;
                /** @default false */
                remove_image?: boolean;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    project: DTOProject;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/project/${id}`,
                method: 'PATCH',
                body: data,
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
         */
        deleteProject: (id: number, params: RequestParams = {}) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/project/${id}`,
                method: 'DELETE',
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name GetDepositAddress
         * @summary Get project deposit address
         * @request GET:/api/v1/project/{id}/deposit/address
         */
        getDepositAddress: (id: number, params: RequestParams = {}) =>
            this.request<
                {
                    /** @example "0QB7BSerVyP9xAKnxp3QpqR8JO2HKwZhl10zsfwg7aJ281ZR" */
                    ton_deposit_wallet: string;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/project/${id}/deposit/address`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name GetProjectDepositsHistory
         * @summary Get project deposits history
         * @request GET:/api/v1/project/{id}/deposits/history
         */
        getProjectDepositsHistory: (id: number, params: RequestParams = {}) =>
            this.request<
                {
                    balance: DTOBalance;
                    history: DTODeposit[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/project/${id}/deposits/history`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name PromoCodeDepositProject
         * @summary Crediting funds with a promo code
         * @request POST:/api/v1/project/{id}/promocode/{promo_code}
         */
        promoCodeDepositProject: (id: number, promoCode: string, params: RequestParams = {}) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/project/${id}/promocode/${promoCode}`,
                method: 'POST',
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GetProjectTonApiTokens
         * @summary Get project TonAPI tokens
         * @request GET:/api/v1/services/tonapi/tokens
         */
        getProjectTonApiTokens: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    items: DTOProjectTonApiToken[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/tokens`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GenerateProjectTonApiToken
         * @summary Generate project TonAPI token
         * @request POST:/api/v1/services/tonapi/generate/token
         */
        generateProjectTonApiToken: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /** @example "My token" */
                name: string;
                /** @example 5 */
                limit_rps?: number | null;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    token: DTOProjectTonApiToken;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/generate/token`,
                method: 'POST',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name UpdateProjectTonApiToken
         * @summary Update project TonAPI token
         * @request PATCH:/api/v1/services/tonapi/token/{id}
         */
        updateProjectTonApiToken: (
            id: number,
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /** @example "My token" */
                name: string;
                /** @example 5 */
                limit_rps?: number | null;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/token/${id}`,
                method: 'PATCH',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name DeleteProjectTonApiToken
         * @summary Delete project TonAPI token
         * @request DELETE:/api/v1/services/tonapi/token/{id}
         */
        deleteProjectTonApiToken: (
            id: number,
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/token/${id}`,
                method: 'DELETE',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GetProjectTonApiTier
         * @summary Get project TonAPI tier
         * @request GET:/api/v1/services/tonapi/tier
         */
        getProjectTonApiTier: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    tier: DTOAppTier;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/tier`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name UpdateProjectTonApiTier
         * @summary Update project TonAPI tier
         * @request PATCH:/api/v1/services/tonapi/tier
         */
        updateProjectTonApiTier: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /**
                 * @format uint32
                 * @example 1
                 */
                tier_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    tier: DTOAppTier;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/tier`,
                method: 'PATCH',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name ValidChangeTonApiTier
         * @summary Valid change TonAPI tier for project
         * @request GET:/api/v1/services/tonapi/tier/valid/buy/{id}
         */
        validChangeTonApiTier: (
            id: number,
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /**
                     * is valid
                     * @example true
                     */
                    valid: boolean;
                    /** @example 0 */
                    unspent_money?: number;
                    /** @example "there are not enough funds on your balance" */
                    details?: string;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/tier/valid/buy/${id}`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GetTonApiTiers
         * @summary Get active TonAPI tiers
         * @request GET:/api/v1/services/tonapi/tiers
         */
        getTonApiTiers: (params: RequestParams = {}) =>
            this.request<
                {
                    items: DTOTier[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/tiers`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags tonapi_service
         * @name GetProjectTonApiPaymentsHistory
         * @summary Get project TonAPI payments history
         * @request GET:/api/v1/services/tonapi/payments/history
         */
        getProjectTonApiPaymentsHistory: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    history: DTOCharge[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/payments/history`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * @description To filter the stats, are expected start and end query parameters in unix format, where end is the day closer to the current one, for example start=1675958400&end=1676908800,
         *
         * @tags tonapi_service
         * @name GetProjectTonApiStats
         * @summary Get project TonAPI stats
         * @request GET:/api/v1/services/tonapi/stats
         */
        getProjectTonApiStats: (
            query: {
                /**
                 * Project ID
                 * @format uint32
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
                 * @default 0
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
                    /** @example {} */
                    stats: any;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/tonapi/stats`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetMessagesPackages
         * @summary Get messages packages
         * @request GET:/api/v1/services/messages/packages
         */
        getMessagesPackages: (params: RequestParams = {}) =>
            this.request<
                {
                    items: DTOMessagesPackage[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/packages`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name BuyMessagesPackage
         * @summary Buy messages package
         * @request POST:/api/v1/services/messages/package
         */
        buyMessagesPackage: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /**
                 * @format uint32
                 * @example 1
                 */
                id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/package`,
                method: 'POST',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetProjectMessagesPaymentsHistory
         * @summary Get project messages payments history
         * @request GET:/api/v1/services/messages/payments/history
         */
        getProjectMessagesPaymentsHistory: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    history: DTOCharge[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/payments/history`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name CreateProjectMessagesApp
         * @summary Create project messages app
         * @request POST:/api/v1/services/messages/app
         */
        createProjectMessagesApp: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /** @example "https://my_dapp.io" */
                url: string;
                /** @example "My dapp" */
                name: string;
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
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/app`,
                method: 'POST',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name DeleteProjectMessagesApp
         * @summary Delete project messages app
         * @request DELETE:/api/v1/services/messages/app
         */
        deleteProjectMessagesApp: (
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/app`,
                method: 'DELETE',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name VerifyProjectMessagesApp
         * @summary Verify project messages app
         * @request POST:/api/v1/services/messages/app/verify
         */
        verifyProjectMessagesApp: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /** @example "DkPazejgbwoAAAAAZFNueLGu-1GCWVgvk5Av_1EK2Ml5LzQItlrivLPtTPMsu5A2" */
                payload: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/app/verify`,
                method: 'POST',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetProjectMessagesApps
         * @summary Get project messages apps
         * @request GET:/api/v1/services/messages/apps
         */
        getProjectMessagesApps: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    items: DTOMessagesApp[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/apps`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetProjectMessagesBalance
         * @summary Get project messages balance
         * @request GET:/api/v1/services/messages/balance
         */
        getProjectMessagesBalance: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /**
                     * @format int32
                     * @example 100
                     */
                    balance: number;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/balance`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetProjectMessagesAppToken
         * @summary Get project messages app token
         * @request GET:/api/v1/services/messages/token
         */
        getProjectMessagesAppToken: (
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @example "TC-PUSHES_ZmUtFjYBOMhLaNZH7Q3BIv_f3ns3UP5HxwyG53pRP147nK7v-LrwwA==" */
                    token: string;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/token`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name RegenerateProjectMessagesAppToken
         * @summary Regenerate project messages app token
         * @request PATCH:/api/v1/services/messages/token
         */
        regenerateProjectMessagesAppToken: (
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @example "TC-PUSHES_ZmUtFjYBOMhLaNZH7Q3BIv_f3ns3UP5HxwyG53pRP147nK7v-LrwwA==" */
                    token: string;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/token`,
                method: 'PATCH',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name GetProjectMessagesStats
         * @summary Get project messages stats
         * @request GET:/api/v1/services/messages/stats
         */
        getProjectMessagesStats: (
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    stats: {
                        /**
                         * @format uint32
                         * @example 10000
                         */
                        users: number;
                        /**
                         * @format int64
                         * @example 100
                         */
                        sent_in_week: number;
                        /**
                         * @format uint32
                         * @example 100
                         */
                        enable_notifications: number;
                        /**
                         * @format int32
                         * @example 100
                         */
                        available_messages: number;
                    };
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/stats`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags messages_service
         * @name SendProjectMessagesPush
         * @summary Send project messages push
         * @request POST:/api/v1/services/messages/push
         * @secure
         */
        sendProjectMessagesPush: (
            data: {
                /** @example "Test title" */
                title?: string;
                /** @example "Test message" */
                message: string;
                /**
                 * Link for user action, the link will open in Tonkeeper dApp Browser
                 * @example "https://my_app.com/event"
                 */
                link?: string;
                /**
                 * If the address has not been transmitted, then push messages will be sent to all users
                 * @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
                 */
                address?: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @example 1000 */
                    success_delivery: number;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/messages/push`,
                method: 'POST',
                body: data,
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags testnet_service
         * @name GetTestnetAvailable
         * @summary Check available coins
         * @request GET:/api/v1/services/testnet/available
         */
        getTestnetAvailable: (params: RequestParams = {}) =>
            this.request<
                {
                    /**
                     * @format uint64
                     * @example 1000000000
                     */
                    balance: number;
                    /**
                     * @format int32
                     * @example 20
                     */
                    price_multiplicator: number;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/testnet/available`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags testnet_service
         * @name BuyTestnetCoins
         * @summary Buy testnet coins
         * @request POST:/api/v1/services/testnet/buy/coins
         */
        buyTestnetCoins: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /** @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b" */
                address: string;
                /**
                 * nano ton are expected
                 * @format int64
                 * @example 1000000000
                 */
                coins: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @example "546e80bd41ff70ecebe22625f7db3ae48e5a24c175697a8e07899de116bec397" */
                    hash: string;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/testnet/buy/coins`,
                method: 'POST',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags testnet_service
         * @name GetProjectTestnetPaymentsHistory
         * @summary Get project testnet payments history
         * @request GET:/api/v1/services/testnet/payments/history
         */
        getProjectTestnetPaymentsHistory: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    history: DTOCharge[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/testnet/payments/history`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags stats_service
         * @name GetStatsDdl
         * @summary Get stats db ddl
         * @request GET:/api/v1/services/stats/ddl
         */
        getStatsDdl: (params: RequestParams = {}) =>
            this.request<
                File,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/ddl`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags db
         * @name EstimateStatsQuery
         * @summary Estimate query
         * @request POST:/api/v1/services/stats/query/estimate
         */
        estimateStatsQuery: (
            data: {
                /**
                 * @format uint32
                 * @example 1647024163
                 */
                project_id: number;
                /** @example "select id from test" */
                query: string;
                /**
                 * cyclic execution of requests
                 * @format int32
                 * @example 10
                 */
                repeat_interval?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOStatsEstimateQuery,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/query/estimate`,
                method: 'POST',
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags stats_service
         * @name SendQueryToStats
         * @summary Send query to stats service
         * @request POST:/api/v1/services/stats/query
         */
        sendQueryToStats: (
            data: {
                /**
                 * @format uint32
                 * @example 1647024163
                 */
                project_id: number;
                /** @example "select id from test" */
                query: string;
                /**
                 * cyclic execution of requests
                 * @format int32
                 * @example 10
                 */
                repeat_interval?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOStatsQueryResult,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/query`,
                method: 'POST',
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags stats_service
         * @name GetSqlResultFromStats
         * @summary Get result by sql query id
         * @request GET:/api/v1/services/stats/query/{id}
         */
        getSqlResultFromStats: (id: string, params: RequestParams = {}) =>
            this.request<
                DTOStatsQueryResult,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/query/${id}`,
                method: 'GET',
                ...params
            }),

        /**
         * No description
         *
         * @tags db
         * @name UpdateStatsQuery
         * @summary Update query
         * @request PATCH:/api/v1/services/stats/query/{id}
         */
        updateStatsQuery: (
            id: string,
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /**
                 * cyclic execution of requests
                 * @format int32
                 * @example 10
                 */
                repeat_interval: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOStatsQuery,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/query/${id}`,
                method: 'PATCH',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags stats_service
         * @name GetSqlHistoryFromStats
         * @summary Get sql history queries
         * @request GET:/api/v1/services/stats/queries/history
         */
        getSqlHistoryFromStats: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
                /**
                 * Offset
                 * @example 100
                 */
                offset?: number;
                /**
                 * Limit
                 * @default 100
                 * @example 50
                 */
                limit?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /**
                     * @format int32
                     * @example 10
                     */
                    count: number;
                    items: DTOStatsQueryResult[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/queries/history`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags stats_service
         * @name GetGraphFromStats
         * @summary Get an intersection between accounts
         * @request POST:/api/v1/services/stats/cosmos/graph
         */
        getGraphFromStats: (
            query: {
                /**
                 * Addresses
                 * @example "EQ..fz,EQ...fa"
                 */
                addresses: string;
                /** @default false */
                only_between?: boolean;
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
                /**
                 * cyclic execution of requests
                 * @format int32
                 * @default 0
                 */
                repeat_interval?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOStatsQueryResult,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/cosmos/graph`,
                method: 'POST',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags stats_service
         * @name GetProjectStatsPaymentsHistory
         * @summary Get project stats payments history
         * @request GET:/api/v1/services/stats/payments/history
         */
        getProjectStatsPaymentsHistory: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    history: DTOCharge[];
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/payments/history`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags stats_service
         * @name StatsChatGptRequest
         * @summary Send request to ChatGPT
         * @request POST:/api/v1/services/stats/gpt
         */
        statsChatGptRequest: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                message: string;
                context?: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    message: string;
                    valid: boolean;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/stats/gpt`,
                method: 'POST',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name CreateInvoicesApp
         * @summary Create invoices app
         * @request POST:/api/v1/services/invoices/app
         */
        createInvoicesApp: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            data: {
                /** @example "Test name" */
                name: string;
                /** @example "Test description" */
                description?: string;
                webhooks?: string[];
                /** @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b" */
                recipient_address: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    app: DTOInvoicesApp;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/app`,
                method: 'POST',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name GetInvoicesApp
         * @summary Get invoices app by project
         * @request GET:/api/v1/services/invoices/app
         */
        getInvoicesApp: (
            query: {
                /**
                 * Project ID
                 * @format uint32
                 */
                project_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    app: DTOInvoicesApp;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/app`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name UpdateInvoicesApp
         * @summary Update invoices app
         * @request PATCH:/api/v1/services/invoices/app/{id}
         */
        updateInvoicesApp: (
            id: number,
            data: {
                /** @example "Test name" */
                name?: string;
                /** @example "Test description" */
                description?: string;
                /** @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b" */
                recipient_address?: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    app: DTOInvoicesApp;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/app/${id}`,
                method: 'PATCH',
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name DeleteInvoicesApp
         * @summary Delete invoices app
         * @request DELETE:/api/v1/services/invoices/app/{id}
         */
        deleteInvoicesApp: (id: number, params: RequestParams = {}) =>
            this.request<
                DTOOk,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/app/${id}`,
                method: 'DELETE',
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name CreateInvoicesAppWebhook
         * @summary Create webhook for app
         * @request POST:/api/v1/services/invoices/app/{id}/webhook
         */
        createInvoicesAppWebhook: (
            id: number,
            data: {
                /** @example "https://mydapp.com/api/handle-invoice-change" */
                webhook: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    app: DTOInvoicesApp;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/app/${id}/webhook`,
                method: 'POST',
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name UpdateInvoicesAppWebhook
         * @summary Update webhook for app
         * @request PATCH:/api/v1/services/invoices/app/{id}/webhook/{webhook_id}
         */
        updateInvoicesAppWebhook: (
            id: number,
            webhookId: string,
            data: {
                /** @example "https://mydapp.com/api/handle-invoice-change" */
                webhook: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    app: DTOInvoicesApp;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/app/${id}/webhook/${webhookId}`,
                method: 'PATCH',
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name DeleteInvoicesAppWebhook
         * @summary Delete webhook for app
         * @request DELETE:/api/v1/services/invoices/app/{id}/webhook/{webhook_id}
         */
        deleteInvoicesAppWebhook: (id: number, webhookId: string, params: RequestParams = {}) =>
            this.request<
                {
                    app: DTOInvoicesApp;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/app/${id}/webhook/${webhookId}`,
                method: 'DELETE',
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name GetInvoicesAppToken
         * @summary Get invoices app token
         * @request GET:/api/v1/services/invoices/token
         */
        getInvoicesAppToken: (
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @example "TC-INVOICES_ZmUtFjYBOMhLaNZH7Q3BIv_f3ns3UP5HxwyG53pRP147nK7v-LrwwA==" */
                    token: string;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/token`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name RegenerateInvoicesAppToken
         * @summary Regenerate invoices app token
         * @request PATCH:/api/v1/services/invoices/token
         */
        regenerateInvoicesAppToken: (
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @example "TC-INVOICES_ZmUtFjYBOMhLaNZH7Q3BIv_f3ns3UP5HxwyG53pRP147nK7v-LrwwA==" */
                    token: string;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/token`,
                method: 'PATCH',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name CreateInvoicesInvoice
         * @summary Create invoice
         * @request POST:/api/v1/services/invoices/invoice
         */
        createInvoicesInvoice: (
            data: {
                /**
                 * nano ton are expected
                 * @example "1000000000"
                 */
                amount: string;
                /**
                 * seconds are expected
                 * @format int64
                 * @example 100
                 */
                life_time: number;
                /** @example "Test description" */
                description?: string;
            },
            query?: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOInvoicesInvoice,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/invoice`,
                method: 'POST',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name GetInvoices
         * @summary Get invoices
         * @request GET:/api/v1/services/invoices
         */
        getInvoices: (
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
                /**
                 * Limit
                 * @default 100
                 * @example 50
                 */
                limit?: number;
                /**
                 * Offset
                 * @example 100
                 */
                offset?: number;
                /**
                 * Field
                 * @example "id"
                 */
                field_order?: DTOGetInvoicesParamsFieldOrder;
                /**
                 * Type order
                 * @example "desc"
                 */
                type_order?: DTOGetInvoicesParamsTypeOrder;
                /**
                 * Search ID
                 * @minLength 1
                 */
                search_id?: string;
                /** Filter status */
                filter_status?: DTOInvoiceStatus[];
                /**
                 * Overpayment
                 * @default false
                 */
                overpayment?: boolean;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    items: DTOInvoicesInvoice[];
                    /**
                     * @format int64
                     * @example 1000
                     */
                    count: number;
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name GetInvoicesInvoice
         * @summary Get invoice
         * @request GET:/api/v1/services/invoices/{id}
         */
        getInvoicesInvoice: (
            id: string,
            query?: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOInvoicesInvoice,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/${id}`,
                method: 'GET',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name UpdateInvoicesInvoice
         * @summary Update invoice
         * @request PATCH:/api/v1/services/invoices/{id}
         */
        updateInvoicesInvoice: (
            id: string,
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            data: {
                refund_amount?: number;
                refunded?: boolean;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOInvoicesInvoice,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/${id}`,
                method: 'PATCH',
                query: query,
                body: data,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name CancelInvoicesInvoice
         * @summary Cancel invoice
         * @request PATCH:/api/v1/services/invoices/{id}/cancel
         */
        cancelInvoicesInvoice: (
            id: string,
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                DTOInvoicesInvoice,
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/${id}/cancel`,
                method: 'PATCH',
                query: query,
                ...params
            }),

        /**
         * No description
         *
         * @tags invoices_service
         * @name GetInvoicesStats
         * @summary Get invoices stats
         * @request GET:/api/v1/services/invoices/stats
         */
        getInvoicesStats: (
            query: {
                /**
                 * App ID
                 * @format uint32
                 */
                app_id: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    stats: {
                        /**
                         * @format uint32
                         * @example 10000
                         */
                        total: number;
                        /**
                         * @format uint64
                         * @example 10000
                         */
                        success_total: number;
                        /**
                         * @format uint64
                         * @example 10000
                         */
                        success_in_week: number;
                        /**
                         * @format uint32
                         * @example 10000
                         */
                        invoices_in_progress: number;
                        /**
                         * @format uint64
                         * @example 1000000000
                         */
                        total_amount_pending: number;
                    };
                },
                {
                    /** Error message */
                    error: string;
                    /** backend error code */
                    code: number;
                }
            >({
                path: `/api/v1/services/invoices/stats`,
                method: 'GET',
                query: query,
                ...params
            })
    };
}
