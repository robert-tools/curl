import type { CURL_PARAM } from './index.d';

export const CURL_OPTIONS: { [key: string]: CURL_PARAM } = {
    method: { key: 'X' },
    data: { key: 'd' },
    silent: { key: 's', noValue: true },
    timeout: { key: 'm', defaultValue: '0' },
};
export const HEADER_OPTIONS: { [key: string]: CURL_PARAM } = {
    ua: { key: 'User-Agent', defaultValue: 'nodejs', noColon: false },
    token: { key: '', defaultValue: '', noColon: true },
};

export const PARAM_KEYS = ['forwarding'];
export const DEFAULT_UA = 'nodejs';
