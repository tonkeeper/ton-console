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

export interface RTError {
    /** @example "error description" */
    error: string;
}

export interface RTWebhookList {
    webhooks: {
        /** @format int64 */
        id: number;
        endpoint: string;
        subscribed_accounts: number;
    }[];
}

export interface RTWebhookAccountTxSubscriptions {
    account_tx_subscriptions: {
        account_id: string;
        /** @format int64 */
        last_delivered_lt: number;
        /** @format date-time */
        failed_at?: string;
        /** @format int64 */
        failed_lt?: number;
        /** @format int64 */
        failed_attempts?: number;
    }[];
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
            baseURL: axiosConfig.baseURL || 'https://rt.tonapi.io'
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
 * @title Realtime API.
 * @version 0.0.1
 * @baseUrl https://rt.tonapi.io
 * @contact Support <support@tonkeeper.com>
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    webhooks = {
        /**
         * @description Get list of webhooks
         *
         * @name GetWebhooks
         * @request GET:/webhooks
         */
        getWebhooks: (
            query: {
                /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
                token?: string;
                project_id: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<RTWebhookList, RTError>({
                path: `/webhooks`,
                method: 'GET',
                query: query,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @name CreateWebhook
         * @request POST:/webhooks
         */
        createWebhook: (
            query: {
                /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
                token?: string;
                project_id: string;
            },
            data: {
                endpoint: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<
                {
                    /** @format int64 */
                    webhook_id: number;
                },
                RTError
            >({
                path: `/webhooks`,
                method: 'POST',
                query: query,
                body: data,
                format: 'json',
                ...params
            }),

        /**
         * @description remove webhook and its subscriptions
         *
         * @name DeleteWebhook
         * @request DELETE:/webhooks/{webhook_id}
         */
        deleteWebhook: (
            webhookId: number,
            query: {
                /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
                token?: string;
                project_id: string;
            },
            params: RequestParams = {}
        ) =>
            this.request<any, RTError>({
                path: `/webhooks/${webhookId}`,
                method: 'DELETE',
                query: query,
                format: 'json',
                ...params
            }),

        /**
         * @description subscribe to notifications for a particular set of accounts
         *
         * @name WebhookAccountTxSubscribe
         * @request POST:/webhooks/{webhook_id}/account-tx/subscribe
         */
        webhookAccountTxSubscribe: (
            webhookId: number,
            query: {
                /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
                token?: string;
                project_id: string;
            },
            data: {
                accounts: {
                    account_id: string;
                }[];
            },
            params: RequestParams = {}
        ) =>
            this.request<any, RTError>({
                path: `/webhooks/${webhookId}/account-tx/subscribe`,
                method: 'POST',
                query: query,
                body: data,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @name WebhookAccountTxUnsubscribe
         * @request POST:/webhooks/{webhook_id}/account-tx/unsubscribe
         */
        webhookAccountTxUnsubscribe: (
            webhookId: number,
            query: {
                /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
                token?: string;
                project_id: string;
            },
            data: {
                accounts: string[];
            },
            params: RequestParams = {}
        ) =>
            this.request<any, RTError>({
                path: `/webhooks/${webhookId}/account-tx/unsubscribe`,
                method: 'POST',
                query: query,
                body: data,
                format: 'json',
                ...params
            }),

        /**
         * No description
         *
         * @name WebhookAccountTxSubscriptions
         * @request GET:/webhooks/{webhook_id}/account-tx/subscriptions
         */
        webhookAccountTxSubscriptions: (
            webhookId: number,
            query: {
                /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
                token?: string;
                project_id: string;
                /** @default 0 */
                offset?: number;
                /**
                 * @max 1000
                 * @default 1000
                 */
                limit?: number;
            },
            params: RequestParams = {}
        ) =>
            this.request<RTWebhookAccountTxSubscriptions, RTError>({
                path: `/webhooks/${webhookId}/account-tx/subscriptions`,
                method: 'GET',
                query: query,
                format: 'json',
                ...params
            })
    };
}
