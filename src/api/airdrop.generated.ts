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
  vesting_parameters?: ADVestingParameters;
}

/** royalty parameters for airdrop */
export interface ADRoyaltyParameters {
  /** @example "100000000" */
  min_commission: string;
}

export interface ADVestingParameters {
  /** List of unlocks */
  unlocks_list: ADUnlockData[];
}

export interface ADUnlockData {
  /**
   * Unlock utime
   * @format int64
   * @example 1740141611
   */
  unlock_time: number;
  /**
   * The percentage rounded to the second decimal place multiplied by 100. 25.15% -> 2515
   * @format int16
   * @min 0
   * @max 10000
   * @example 2500
   */
  fraction: number;
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

export type ADUserClaim = ADUserClaimInfo & {
  claim_massage?: ADInternalMessage;
};

export interface ADUserClaimInfo {
  /**
   * Jetton master contract in user-friendly form
   * @example "kQABcHP_oXkYNCx3HHKd4rxL371RRl-O6IwgwqYZ7IT6Ha-u"
   */
  jetton: string;
  /**
   * Jetton amount available for claim now
   * @example "597968399"
   */
  available_jetton_amount: string;
  /**
   * Total Jetton amount for airdrop
   * @example "597968399"
   */
  total_jetton_amount: string;
  /**
   * Already claimed Jetton amount
   * @example "597968399"
   */
  claimed_jetton_amount: string;
  vesting_parameters?: ADVestingParameters;
}

export enum ADAirdropDataClamStatusEnum {
  ADOpened = "opened",
  ADClosed = "closed",
}

export enum ADDistributorDataAirdropStatusEnum {
  ADNotDeployed = "not_deployed",
  ADLackOfJettons = "lack_of_jettons",
  ADReady = "ready",
  ADBlocked = "blocked",
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
  public baseUrl: string = "http://localhost:8888";
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
 * @title Airdrop API for TON Console
 * @version 0.2.0
 * @baseUrl http://localhost:8888
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  v2 = {
    /**
     * No description
     *
     * @tags admin
     * @name GetAirdropData
     * @summary Get airdrop info
     * @request GET:/v2/airdrop
     */
    getAirdropData: (
      query: {
        /**
         * Airdrop ID
         * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
         */
        id: string;
        /** Project ID */
        project_id?: number | string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ADAirdropData, ADError>({
        path: `/v2/airdrop`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name NewAirdrop
     * @summary Generate new airdrop
     * @request POST:/v2/airdrop
     */
    newAirdrop: (
      data: {
        /** claim admin wallet address */
        admin: string;
        /** jetton master contract address */
        jetton: string;
        /** royalty parameters for airdrop */
        royalty_parameters: ADRoyaltyParameters;
        vesting_parameters?: ADVestingParameters;
      },
      query?: { project_id?: number | string },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b" */
          id: string;
        },
        ADError
      >({
        path: `/v2/airdrop`,
        method: "POST",
        query: query,
        body: data,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name FileUpload
     * @summary Upload withdrawals file
     * @request POST:/v2/airdrop/upload
     */
    fileUpload: (
      query: {
        /**
         * Airdrop ID
         * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
         */
        id: string;
        /** Project ID */
        project_id?: number | string;
      },
      data: {
        url?: string;
        /**
         * The CSV file to upload
         * @format binary
         */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ADError>({
        path: `/v2/airdrop/upload`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name GetDistributorsData
     * @summary Get distributors info
     * @request GET:/v2/airdrop/distributors
     */
    getDistributorsData: (
      query: {
        /**
         * Airdrop ID
         * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
         */
        id: string;
        /** Project ID */
        project_id?: number | string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ADDistributorsData, ADError>({
        path: `/v2/airdrop/distributors`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name GetRoyaltyData
     * @summary Get royalty info
     * @request GET:/v2/airdrop/royalty
     */
    getRoyaltyData: (
      query: {
        /**
         * Airdrop ID
         * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
         */
        id: string;
        /** Project ID */
        project_id?: number | string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ADRoyaltiesData, ADError>({
        path: `/v2/airdrop/royalty`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name GetConfig
     * @summary Get config params
     * @request GET:/v2/config
     */
    getConfig: (
      query?: { project_id?: number | string },
      params: RequestParams = {},
    ) =>
      this.request<ADConfig, ADError>({
        path: `/v2/config`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name OpenClaim
     * @summary Open claim method for users
     * @request POST:/v2/airdrop/start
     */
    openClaim: (
      query: {
        /**
         * Airdrop ID
         * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
         */
        id: string;
        /** Project ID */
        project_id?: number | string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ADError>({
        path: `/v2/airdrop/start`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name CloseClaim
     * @summary Close claim method for users
     * @request POST:/v2/airdrop/stop
     */
    closeClaim: (
      query: {
        /**
         * Airdrop ID
         * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
         */
        id: string;
        /** Project ID */
        project_id?: number | string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ADError>({
        path: `/v2/airdrop/stop`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags claim
     * @name GetUserClaim
     * @summary Get user claim data
     * @request GET:/v2/airdrop/claim/{account}
     */
    getUserClaim: (
      account: string,
      query: {
        /**
         * Airdrop ID
         * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
         */
        id: string;
        /** Project ID */
        project_id?: number | string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ADUserClaim, ADError | ADUserClaimInfo>({
        path: `/v2/airdrop/claim/${account}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
