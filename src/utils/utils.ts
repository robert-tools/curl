// external dependencies
import { getUrlKey } from '@robert.tools/uri';
import { filterObject, getProp } from '@robert.tools/utils';
import { $string, URI } from '@robert.tools/typings';

// internal dependencies
import {
    CURL_OPTIONS,
    DEFAULT_UA,
    HEADER_OPTIONS,
    PARAM_KEYS,
} from '../index.config';

// types
import type { CURL, CURL_OPTS, CURL_PARAMS } from '../index.d';

/**
 * 🎯 Generates a curl header string.
 * @param {$string} key ➡️ The header key.
 * @param {string} value ➡️ The header value.
 * @returns {$string} 📤 The curl header string.
 */
export const _setHeader = (key: $string, value: string, col = true): CURL => {
    const hasKey = key && key !== '' ? true : false;
    const hasValue = value && value !== '' ? true : false;
    return hasKey && hasValue ? `-H "${key}${col ? ':' : ''} ${value}"` : '';
};

/**
 * 🎯 Iterates over the provided curl options and generates curl command string.
 * @param {any} options ➡️ values for the curl parameters.
 * @param {CURL_PARAMS} OPTS ➡️ corresponding curl parameter configurations.
 * @returns {string} 📤 The generated curl command string.
 */
export const _iterateOptions = (options: any, OPTS: CURL_PARAMS): string => {
    let result = '';
    for (const key of Object.keys(OPTS)) {
        const item = OPTS[key];
        const col = item.noColon ? '' : ':';

        const isHeader = item.hasOwnProperty('noColon');
        const val = getProp(options, key);
        if (val && (val.toString().trim() !== '' || item.noValue === true)) {
            const defaultValue = item.noValue ? '' : val;
            const v = isHeader
                ? `${item.key}${col} ${val}`.trim()
                : defaultValue;
            const opts = isHeader ? { quote: '"' } : {};
            const tmp = _setParam(key, v, opts);
            result += ` ${tmp.trim()}`;
        }
    }
    return ` ${result.trim()} `;
};

/**
 * 🎯 Set all curl options based on the provided parameters.
 * @param {URI} url ➡️ The URL for the curl request.
 * @param {HTTP_OPTS} options ➡️ The HTTP options object.
 * @returns {CURL} 📤 The generated curl options string.
 */
export const _setParams = (url: URI, options: CURL_OPTS): CURL => {
    let result: CURL = '';
    // make a copy of options
    const headerOpts = { ...getProp(options, 'header', {}) };
    const opts = { ...filterObject(options, ['header'], 'exclude') };
    // flags
    const urlKey = getUrlKey(url);

    // set ua prop
    const isGithub = urlKey === 'github';
    // no user agent for github or if noUA= true
    if (isGithub || getProp(options, 'noUA')) {
        headerOpts['ua'] = '';
    } else {
        headerOpts['ua'] = getProp(headerOpts, 'ua', DEFAULT_UA);
    }
    // custom forwarding as alternative to -L
    if (getProp(options, 'forwarding') === true) {
        opts['data'] = { forwarding: true };
    }

    const token = getProp(headerOpts, 'token');
    // setup auth header if token is provided
    const TOKEN_KEYS: { [key: string]: string } = {
        github: 'Authorization: token',
        gitlab: 'PRIVATE-TOKEN:',
    };
    const tokenKey = getProp(TOKEN_KEYS, urlKey);
    headerOpts['token'] = tokenKey && token ? `${tokenKey} ${token}` : '';

    result += _iterateOptions(headerOpts, HEADER_OPTIONS);
    result += _iterateOptions(opts, CURL_OPTIONS);

    return result.replace(/\s{2,}/g, ' ').trim();
};

/**
 * 🎯 Extracts the value of a specific curl parameter from the request string.
 * @param {URI} request ➡️ The curl request string.
 * @param {string} key ➡️ The curl parameter key to extract.
 * @returns {string} 📤 The value of the specified curl parameter.
 */
export const _getParamValue = (request: URI, key: string): string => {
    const regexSQ = new RegExp(`-${key}\\s+[']([^']+)[']`, 'i');
    const regexDQ = new RegExp(`-${key}\\s+["]([^"]+)["]`, 'i');
    const regexNQ = new RegExp(`-${key}\\s+([^\\s]+)`, 'i');
    const match =
        request.match(regexSQ) ||
        request.match(regexDQ) ||
        request.match(regexNQ);
    return match ? match[1].replace(/^['"]|['"]$/g, '') : '';
};

/**
 * 🎯 Formats the input value with the specified quote and optional filter keys.
 * @param {any} input ➡️ The input value to format.
 * @param {string} quote ➡️ The quote character to use for formatting.
 * @param {string[]} KEYS ➡️ Optional array of keys to filter the input object.
 * @returns {string} 📤 The formatted value.
 */
export const _setValue = (
    input: any,
    quote: string,
    KEYS: string[] = []
): string => {
    const isJSON = typeof input === 'object';
    const doFilter = isJSON && KEYS.length > 0;
    const value: any = doFilter ? filterObject(input, KEYS) : input;
    const str = isJSON ? JSON.stringify(value) : value;
    const hasSpace = /\s+/.test(input);
    const isJSONStr = typeof input === 'string' && /^\s*[\{\[]/.test(input);
    const finalValue = hasSpace || isJSONStr ? `${quote}${str}${quote}` : input;
    return finalValue;
};

/**
 * 🎯 Retrieves the allowed curl option for the given key.
 * @param {string} key ➡️ The key to check for allowed curl option.
 * @returns {string | undefined} 📤 The allowed curl option key or undefined if not allowed.
 */
export const _getAllowedOption = (key: string): $string => {
    const k = CURL_OPTIONS[key]?.key;
    if (k) return k;
    if (HEADER_OPTIONS[key]) return 'H';
    return undefined;
};

/**
 * 🎯 Generates the curl parameter string for the specified key and value.
 * @param {string} key ➡️ The curl parameter key to set.
 * @param {any} input ➡️ The value to set for the specified curl parameter.
 * @param {object} opts ➡️ Optional configuration object.
 * @returns {CURL} 📤 The generated curl parameter string.
 */
export const _setParam = (key: string, input: any, opts = {}): CURL => {
    if (input === undefined || input === null) return '';
    let forward = '';
    const k = _getAllowedOption(key);
    if (k === undefined) return '';
    const isJSON = typeof input === 'object';

    const value: any = isJSON ? filterObject(input, PARAM_KEYS) : input;
    let hasOutput = true;
    switch (key) {
        case 'data': {
            if (typeof value === 'object') {
                hasOutput = Object.keys(value).length > 0; // dont add empty data
            }
            break;
        }
    }
    const quote = getProp(opts, 'quote', "'");
    // if (input === undefined || input === null || input === '') return '';
    if (hasOutput) {
        const finalValue = _setValue(input, quote, PARAM_KEYS);
        forward = ` -${k} ${finalValue} `;
    }
    return forward;
};
