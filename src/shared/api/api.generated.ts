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
    /** @example 1 */
    burst: number;
    /** @example 5 */
    rpc: number;
    /**
     * The price is in nano tons
     * @format int64
     * @example 1000000000
     */
    ton_price: number;
}

export interface DTOAppTier {
    /**
     * @format int64
     * @example 1
     */
    id: number;
    /** @example "Test tier" */
    name: string;
    /** @example 1 */
    burst: number;
    /** @example 5 */
    rpc: number;
    /** @example 100 */
    ton_price: number;
    /** @example true */
    active: boolean;
    /** @example "2023-03-23" */
    date_create: string;
}

export interface DTODeposit {
    /** @example "0QB7BSerVyP9xAKnxp3QpqR8JO2HKwZhl10zsfwg7aJ281ZR" */
    address: string;
    /** @example "1000000" */
    balance: string;
    /** @example "TON" */
    currency: string;
}

export interface DTOCharge {
    /**
     * @format int64
     * @example 1534355233
     */
    project_id: number;
    /** @example "payment_tier" */
    type_of_charge: string;
    info?: string;
    /**
     * @format int64
     * @example 1000000000
     */
    amount: number;
    /** @example "2023-03-23" */
    date_create: string;
}

export interface DTOBalance {
    /** @example "TON" */
    currency?: string;
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
    tonapi_tier?: DTOAppTier;
    tonapi_tokens?: DTOToken[];
    /** @example "https://tonapi.io/static/test.png" */
    avatar: string;
    /** @example "2023-03-23" */
    date_create: string;
}

export interface DTOToken {
    /**
     * @format int64
     * @example 1
     */
    id: number;
    /** @example "AE5TZRWIIOR2O2YAAAAGFP2HEWFZJYBP222A567CBF6JIL7S4RIZSCOAZRZOEW7AKMRICGQ" */
    token: string;
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
         * @tags tier
         * @name GetTiers
         * @summary Get active tiers
         * @request GET:/api/v1/tiers
         * @secure
         */
        getTiers: (params: RequestParams = {}) =>
            this.request<
                {
                    items: DTOTier[];
                },
                DTOError
            >({
                path: `/api/v1/tiers`,
                method: 'GET',
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
                 * @format int64
                 * @example 1
                 */
                tier_id?: number;
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
         * @name GenerateProjectToken
         * @summary Generate project token
         * @request POST:/api/v1/project/{id}/generate/token
         * @secure
         */
        generateProjectToken: (id: number, params: RequestParams = {}) =>
            this.request<
                {
                    /** @example "AE5TZRWIAAAAAAAAAAADIABPI6PKEZ2W6TIKPNEIMNIZF6LMAXTXHWLTK3OXRIXC62AUWWQ" */
                    token?: string;
                },
                DTOError
            >({
                path: `/api/v1/project/${id}/generate/token`,
                method: 'POST',
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name DeleteProjectToken
         * @summary Delete project token
         * @request DELETE:/api/v1/project/{id}/token/{token_id}
         * @secure
         */
        deleteProjectToken: (id: number, tokenId: number, params: RequestParams = {}) =>
            this.request<DTOOk, DTOError>({
                path: `/api/v1/project/${id}/token/${tokenId}`,
                method: 'DELETE',
                secure: true,
                ...params
            })
    };
    project = {
        /**
         * No description
         *
         * @tags project
         * @name GetDepositAddress
         * @summary Get project deposit address
         * @request GET:/project/{id}/payments/deposit-address
         * @secure
         */
        getDepositAddress: (id: number, params: RequestParams = {}) =>
            this.request<
                {
                    /** @example "0QB7BSerVyP9xAKnxp3QpqR8JO2HKwZhl10zsfwg7aJ281ZR" */
                    ton_deposit_wallet?: string;
                },
                DTOError
            >({
                path: `/project/${id}/payments/deposit-address`,
                method: 'GET',
                secure: true,
                ...params
            }),

        /**
         * No description
         *
         * @tags project
         * @name GetPaymentsHistory
         * @summary Get payments/history
         * @request GET:/project/{id}/payments/history
         * @secure
         */
        getPaymentsHistory: (id: number, params: RequestParams = {}) =>
            this.request<
                {
                    balance?: DTOBalance;
                    history?: {
                        payments?: DTOCharge[];
                        deposits?: DTODeposit[];
                    };
                },
                DTOError
            >({
                path: `/project/${id}/payments/history`,
                method: 'GET',
                secure: true,
                ...params
            })
    };
}
