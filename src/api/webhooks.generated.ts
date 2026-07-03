/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
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

export interface RTUsageStats {
  /** @format date-time */
  period_started_at: string;
  /** @format date-time */
  period_ended_at?: string;
  /** @format int64 */
  account_subscriptions: number;
  /** @format int64 */
  webhooks_delivered: number;
  /** @format int64 */
  webhooks_failed: number;
}

export interface RTWebhookLogs {
  /** @format int64 */
  next_offset?: number;
  logs: {
    message: string;
    event_type: string;
    /** @format date-time */
    timestamp: string;
  }[];
}

export interface RTWebhookList {
  webhooks: {
    /** @format int64 */
    id: number;
    endpoint: string;
    token: string;
    subscribed_accounts: number;
    subscribed_msg_opcodes: number;
    subscribed_to_mempool: boolean;
    subscribed_to_new_contracts: boolean;
    status: RTWebhookListStatusEnum;
    /** @format date-time */
    status_updated_at: string;
    /** @format date-time */
    last_online_at: string;
    status_failed_attempts: number;
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

export interface RTWebhookMsgOpcodeSubscriptions {
  subscriptions: {
    opcode: string;
    status: RTWebhookMsgOpcodeSubscriptionsStatusEnum;
    /** @format date-time */
    disabled_at?: string;
    disabled_reason?: string;
  }[];
}

export enum RTWebhookListStatusEnum {
  RTOnline = "online",
  RTOffline = "offline",
  RTSuspended = "suspended",
}

export enum RTWebhookMsgOpcodeSubscriptionsStatusEnum {
  RTActive = "active",
  RTDisabled = "disabled",
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
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

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://rt.tonapi.io";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
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
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
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
 * @title Realtime API.
 * @version 0.0.1
 * @baseUrl https://rt.tonapi.io
 * @contact Support <support@tonkeeper.com>
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  webhooks = {
    /**
     * @description Get list of webhooks
     *
     * @name GetWebhooks
     * @request GET:/webhooks
     */
    getWebhooks: (
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<RTWebhookList, RTError>({
        path: `/webhooks`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CreateWebhook
     * @request POST:/webhooks
     */
    createWebhook: (
      data: {
        endpoint: string;
      },
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @format int64 */
          webhook_id: number;
          /** secret token which will be used by TONAPI to authenticate itself when sending notifications to the webhook endpoint */
          token: string;
        },
        RTError
      >({
        path: `/webhooks`,
        method: "POST",
        query: query,
        body: data,
        format: "json",
        ...params,
      }),

    /**
     * @description remove webhook and its subscriptions
     *
     * @name DeleteWebhook
     * @request DELETE:/webhooks/{webhook_id}
     */
    deleteWebhook: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description generate a new secret token which will be used by TONAPI to authenticate itself when sending notifications to the webhook endpoint. The old token will be invalidated.
     *
     * @name WebhookGenerateNewToken
     * @request POST:/webhooks/{webhook_id}/generate-new-token
     */
    webhookGenerateNewToken: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          token: string;
        },
        RTError
      >({
        path: `/webhooks/${webhookId}/generate-new-token`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Let TONAPI know that webhook is ready to receive notifications after it has been unavailable
     *
     * @name WebhookBackOnline
     * @request POST:/webhooks/{webhook_id}/back-online
     */
    webhookBackOnline: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/back-online`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get logs of failed attempts to deliver notifications to the webhook
     *
     * @name GetFailureLogs
     * @request GET:/webhooks/{webhook_id}/logs
     */
    getFailureLogs: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
        /**
         * @min 0
         * @default 0
         */
        offset?: number;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<RTWebhookLogs, RTError>({
        path: `/webhooks/${webhookId}/logs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description subscribe to notifications for a particular set of accounts
     *
     * @name WebhookAccountTxSubscribe
     * @request POST:/webhooks/{webhook_id}/account-tx/subscribe
     */
    webhookAccountTxSubscribe: (
      webhookId: number,
      data: {
        accounts: {
          account_id: string;
        }[];
      },
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/account-tx/subscribe`,
        method: "POST",
        query: query,
        body: data,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WebhookAccountTxUnsubscribe
     * @request POST:/webhooks/{webhook_id}/account-tx/unsubscribe
     */
    webhookAccountTxUnsubscribe: (
      webhookId: number,
      data: {
        accounts: string[];
      },
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/account-tx/unsubscribe`,
        method: "POST",
        query: query,
        body: data,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WebhookAccountTxSubscriptions
     * @request GET:/webhooks/{webhook_id}/account-tx/subscriptions
     */
    webhookAccountTxSubscriptions: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
        /** @default 0 */
        offset?: number;
        /**
         * @max 1000
         * @default 1000
         */
        limit?: number;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<RTWebhookAccountTxSubscriptions, RTError>({
        path: `/webhooks/${webhookId}/account-tx/subscriptions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WebhookNewContractsSubscriptions
     * @request GET:/webhooks/{webhook_id}/msg-opcode/subscriptions
     */
    webhookNewContractsSubscriptions: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
        /** @default 0 */
        offset?: number;
        /**
         * @max 1000
         * @default 1000
         */
        limit?: number;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<RTWebhookMsgOpcodeSubscriptions, RTError>({
        path: `/webhooks/${webhookId}/msg-opcode/subscriptions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description receive a notification when a new contract is deployed to the blockchain
     *
     * @name WebhookNewContractSubscribe
     * @request POST:/webhooks/{webhook_id}/subscribe-new-contracts
     */
    webhookNewContractSubscribe: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/subscribe-new-contracts`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description receive a notification when a new contract is deployed to the blockchain
     *
     * @name WebhookNewContractUnsubscribe
     * @request POST:/webhooks/{webhook_id}/unsubscribe-new-contracts
     */
    webhookNewContractUnsubscribe: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/unsubscribe-new-contracts`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description receive a notification when there is a new message with a given opcode
     *
     * @name WebhookMsgOpcodeSubscribe
     * @request POST:/webhooks/{webhook_id}/subscribe-msg-opcode/{opcode}
     */
    webhookMsgOpcodeSubscribe: (
      webhookId: number,
      opcode: string,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/subscribe-msg-opcode/${opcode}`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description stop receiving a notification about a new message with a given opcode
     *
     * @name WebhookMsgOpcodeUnsubscribe
     * @request POST:/webhooks/{webhook_id}/unsubscribe-msg-opcode/{opcode}
     */
    webhookMsgOpcodeUnsubscribe: (
      webhookId: number,
      opcode: string,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/unsubscribe-msg-opcode/${opcode}`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description subscribe to notifications for mempool messages
     *
     * @name WebhookMempoolSubscribe
     * @request POST:/webhooks/{webhook_id}/mempool/subscribe
     */
    webhookMempoolSubscribe: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/mempool/subscribe`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WebhookMempoolUnsubscribe
     * @request POST:/webhooks/{webhook_id}/mempool/unsubscribe
     */
    webhookMempoolUnsubscribe: (
      webhookId: number,
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<any, RTError>({
        path: `/webhooks/${webhookId}/mempool/unsubscribe`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  usageStats = {
    /**
     * No description
     *
     * @name GetUsageStats
     * @request GET:/usage-stats
     */
    getUsageStats: (
      query?: {
        /** @example "NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQ3..." */
        token?: string;
              project_id: string;
        network?: "mainnet" | "testnet";
      },
      params: RequestParams = {},
    ) =>
      this.request<RTUsageStats, RTError>({
        path: `/usage-stats`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
