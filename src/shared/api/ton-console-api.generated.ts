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

export interface DTOWebhook {
    /**
     * @format int64
     * @example 1
     */
    id: number;
    /**
     * @format int64
     * @example 1464363297
     */
    user_id: number;
    /**
     * @format int64
     * @example 2465363097
     */
    app_id: number;
    /** @example "http://tonapi.io/callback" */
    payload_url: string;
    /** @example "it's my secret" */
    secret: string;
    /** @example ["0:15d570f9c0c67e8e6d40f5c69be049a247dd6c0e841d31ac8dcc3edf4a57d057","0:85d570f9c0c67e8e6v40f2c69be049a217dd6c0f841d31ac8dcc3edf4a57d057"] */
    addresses?: string[];
    /** @example true */
    active: boolean;
    type_actions: 'account_event';
    /**
     * @format int64
     * @example 1678275313
     */
    date_create: number;
}

export interface DTOApp {
    /**
     * @format int64
     * @example 2465363097
     */
    id: number;
    /**
     * @format int64
     * @example 1464363297
     */
    user_id: number;
    /** @example "Test App" */
    name: string;
    /** @example "https://tonapi.io/static/test.png" */
    avatar?: string;
    app_tokens?: DTOAppToken[];
    webhooks?: DTOWebhook[];
    /** @example "https://tonapi.io/login?app=2465363097" */
    oauth_url?: string;
    /** @example false */
    is_ban: boolean;
    /** @example "firebase_creds.json" */
    firebase_filename?: string;
    /** @example true */
    enable_notifications?: boolean;
    /**
     * @format int64
     * @example 1678275313
     */
    date_create: number;
}

export interface DTOAppToken {
    /** @example 1 */
    id: number;
    /**
     * @format int64
     * @example 1464363297
     */
    user_id: number;
    /**
     * @format int64
     * @example 2465363097
     */
    app_id: number;
    tire: DTOAppTokenTire;
    /** @example "AFWRUVK5QHVRFFAAAAACNAS5QU22SHA2D4SMH3SFJOOQB5PCBU7Z7KDDWKQT5KI2YNABHBI" */
    token: string;
    /** @example false */
    is_ban: boolean;
    /** @example true */
    active: boolean;
    /**
     * @format int64
     * @example 1678275313
     */
    date_create: number;
}

export interface DTOAppTokenTire {
    /** @example "Test tire" */
    id?: string;
    /** @example 1 */
    burst: number;
    /** @example 5 */
    rpc: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat;
    /** request body */
    body?: unknown;
    /** base url */
    baseUrl?: string;
    /** request cancellation token */
    cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string;
    baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
    securityWorker?: (
        securityData: SecurityDataType | null
    ) => Promise<RequestParams | void> | RequestParams | void;
    customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
    data: D;
    error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
    Json = 'application/json',
    FormData = 'multipart/form-data',
    UrlEncoded = 'application/x-www-form-urlencoded',
    Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = 'http://localhost:8888';
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
    private abortControllers = new Map<CancelToken, AbortController>();
    private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

    private baseApiParams: RequestParams = {
        credentials: 'same-origin',
        headers: {},
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    };

    constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
        Object.assign(this, apiConfig);
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected encodeQueryParam(key: string, value: any) {
        const encodedKey = encodeURIComponent(key);
        return `${encodedKey}=${encodeURIComponent(
            typeof value === 'number' ? value : `${value}`
        )}`;
    }

    protected addQueryParam(query: QueryParamsType, key: string) {
        return this.encodeQueryParam(key, query[key]);
    }

    protected addArrayQueryParam(query: QueryParamsType, key: string) {
        const value = query[key];
        return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
    }

    protected toQueryString(rawQuery?: QueryParamsType): string {
        const query = rawQuery || {};
        const keys = Object.keys(query).filter(key => 'undefined' !== typeof query[key]);
        return keys
            .map(key =>
                Array.isArray(query[key])
                    ? this.addArrayQueryParam(query, key)
                    : this.addQueryParam(query, key)
            )
            .join('&');
    }

    protected addQueryParams(rawQuery?: QueryParamsType): string {
        const queryString = this.toQueryString(rawQuery);
        return queryString ? `?${queryString}` : '';
    }

    private contentFormatters: Record<ContentType, (input: any) => any> = {
        [ContentType.Json]: (input: any) =>
            input !== null && (typeof input === 'object' || typeof input === 'string')
                ? JSON.stringify(input)
                : input,
        [ContentType.Text]: (input: any) =>
            input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
        [ContentType.FormData]: (input: any) =>
            Object.keys(input || {}).reduce((formData, key) => {
                const property = input[key];
                formData.append(
                    key,
                    property instanceof Blob
                        ? property
                        : typeof property === 'object' && property !== null
                        ? JSON.stringify(property)
                        : `${property}`
                );
                return formData;
            }, new FormData()),
        [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
    };

    protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
        return {
            ...this.baseApiParams,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.baseApiParams.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {})
            }
        };
    }

    protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken);
            if (abortController) {
                return abortController.signal;
            }
            return void 0;
        }

        const abortController = new AbortController();
        this.abortControllers.set(cancelToken, abortController);
        return abortController.signal;
    };

    public abortRequest = (cancelToken: CancelToken) => {
        const abortController = this.abortControllers.get(cancelToken);

        if (abortController) {
            abortController.abort();
            this.abortControllers.delete(cancelToken);
        }
    };

    public request = async <T = any, E = any>({
        body,
        secure,
        path,
        type,
        query,
        format,
        baseUrl,
        cancelToken,
        ...params
    }: FullRequestParams): Promise<HttpResponse<T, E>> => {
        const secureParams =
            ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const queryString = query && this.toQueryString(query);
        const payloadFormatter = this.contentFormatters[type || ContentType.Json];
        const responseFormat = format || requestParams.format;

        return this.customFetch(
            `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
            {
                ...requestParams,
                headers: {
                    ...(requestParams.headers || {}),
                    ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
                },
                signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
                body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
            }
        ).then(async response => {
            const r = response as HttpResponse<T, E>;
            r.data = null as unknown as T;
            r.error = null as unknown as E;

            const data = !responseFormat
                ? r
                : await response[responseFormat]()
                      .then(data => {
                          if (r.ok) {
                              r.data = data;
                          } else {
                              r.error = data;
                          }
                          return r;
                      })
                      .catch(e => {
                          r.error = e;
                          return r;
                      });

            if (cancelToken) {
                this.abortControllers.delete(cancelToken);
            }

            if (!response.ok) throw data;
            return data;
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
    v1 = {
        /**
         * @description Auth via telegram
         *
         * @tags auth
         * @name AuthViaTg
         * @request POST:/v1/auth/tg
         */
        authViaTg: (
            data: {
                /**
                 * @format int64
                 * @example "1261871881"
                 */
                id: number;
                /** @example "Test" */
                first_name?: string;
                /** @example "Testov" */
                photo_url?: string;
                /** @example "testov" */
                username?: string;
                hash: string;
                /**
                 * @format int64
                 * @example "1678275313"
                 */
                auth_date: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    user: DTOUser;
                },
                DTOError
            >({
                path: `/v1/auth/tg`,
                method: 'POST',
                body: data,
                ...params
            }),

        /**
         * @description Generate payload for TON Connect
         *
         * @tags auth
         * @name AuthGeneratePayload
         * @request POST:/v1/auth/ton-proof/generate_payload
         */
        authGeneratePayload: (params: RequestParams = {}) =>
            this.request<
                {
                    payload: string;
                },
                DTOError
            >({
                path: `/v1/auth/ton-proof/generate_payload`,
                method: 'POST',
                ...params
            }),

        /**
         * @description Auth via TON Connect
         *
         * @tags auth
         * @name AuthViaTonConnect
         * @request POST:/v1/auth/ton-proof/check_proof
         */
        authViaTonConnect: (
            data: {
                /** @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b" */
                address: string;
                /**
                 * -3 is testnet network, -239 is mainnet network
                 * @example "-3"
                 */
                network: '-3' | '-239';
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
                    payload?: string;
                    state_init?: string;
                };
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    token: string;
                },
                DTOError
            >({
                path: `/v1/auth/ton-proof/check_proof`,
                method: 'POST',
                body: data,
                ...params
            }),

        /**
         * @description Logout from the system
         *
         * @tags account
         * @name AccountLogout
         * @request POST:/v1/account/logout
         * @secure
         */
        accountLogout: (params: RequestParams = {}) =>
            this.request<DTOOk, DTOError>({
                path: `/v1/account/logout`,
                method: 'POST',
                secure: true,
                ...params
            }),

        /**
         * @description Get apps by user account
         *
         * @tags app
         * @name GetApps
         * @request GET:/v1/apps
         * @secure
         */
        getApps: (params: RequestParams = {}) =>
            this.request<
                {
                    items: DTOApp[];
                },
                DTOError
            >({
                path: `/v1/apps`,
                method: 'GET',
                secure: true,
                ...params
            }),

        /**
         * @description Create app
         *
         * @tags app
         * @name CreateApp
         * @request POST:/v1/app
         * @secure
         */
        createApp: (
            data: {
                /** @example "Test App" */
                name?: string;
                /** @example "https://tonapi.io" */
                oauth_url?: string;
                /** @format binary */
                image?: File;
            },
            params: RequestParams = {}
        ) =>
            this.request<DTOOk, DTOError>({
                path: `/v1/app`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.FormData,
                ...params
            }),

        /**
         * @description Delete app
         *
         * @tags app
         * @name DeleteApp
         * @request DELETE:/v1/app/{id}
         * @secure
         */
        deleteApp: (id: number, params: RequestParams = {}) =>
            this.request<DTOOk, DTOError>({
                path: `/v1/app/${id}`,
                method: 'DELETE',
                secure: true,
                ...params
            }),

        /**
         * @description Update app
         *
         * @tags app
         * @name UpdateApp
         * @request PATCH:/v1/app/{id}
         * @secure
         */
        updateApp: (
            id: number,
            data: {
                /** @example "Test App" */
                name?: string;
                /** @example true */
                enable_notifications?: boolean;
                /** @example true */
                remove_push_credentials?: boolean;
                /** @example "https://tonapi.io" */
                oauth_url?: string;
                /** @format binary */
                image?: File;
                /** @format binary */
                firebase_credentials?: File;
            },
            params: RequestParams = {}
        ) =>
            this.request<DTOOk, DTOError>({
                path: `/v1/app/${id}`,
                method: 'PATCH',
                body: data,
                secure: true,
                type: ContentType.FormData,
                ...params
            })
    };
    app = {
        /**
         * @description Generate app token
         *
         * @tags app
         * @name GenerateAppToken
         * @request POST:/app/{id}/generate
         * @secure
         */
        generateAppToken: (id: number, params: RequestParams = {}) =>
            this.request<DTOOk, DTOError>({
                path: `/app/${id}/generate`,
                method: 'POST',
                secure: true,
                ...params
            }),

        /**
         * @description Delete app token
         *
         * @tags app
         * @name DeleteAppToken
         * @request DELETE:/app/token/{id}
         * @secure
         */
        deleteAppToken: (id: number, params: RequestParams = {}) =>
            this.request<DTOOk, DTOError>({
                path: `/app/token/${id}`,
                method: 'DELETE',
                secure: true,
                ...params
            })
    };
}
