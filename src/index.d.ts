import type { StringLike } from '@robert.tools/typings';

export type CURL = StringLike<`${string}`>;
export type CURL_PARAM = {
    key: string;
    type?: string;
    defaultValue?: string;
    noColon?: boolean;
    noValue?: boolean;
};
export type CURL_PARAMS = {
    [key: string]: CURL_PARAM;
};
export type CURL_ITEM = {
    [key: string]: any;
};

export type CURL_HEADER = {
    ua?: string;
};

export type CURL_OPTS = {
    header?: CURL_HEADER;
    method?: string;
    data?: string;
    silent?: boolean;
    timeout?: number;
    noUA?: boolean;
    forwarding?: boolean;
    noEncode?: boolean;
};
