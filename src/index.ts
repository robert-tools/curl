// external dependencies
import { LOG } from '@robert.tools/log';
import { command } from '@robert.tools/cmd';

// internal dependencies
import { _getParamValue, _setParams } from './utils/utils';
import { CURL_OPTIONS } from './index.config';
import { URI } from '@robert.tools/typings';

// types
import type { CURL_ITEM, CURL_OPTS } from './index.d';

/**
 * 🎯 Parses the curl request string to extract the curl parameters.
 * @param {URI} request ➡️ The curl request string.
 * @returns {CURL_ITEM} 📤 The parsed curl parameters object.
 */
export const getCurlData = (request: URI): any => {
    const result: CURL_ITEM = {};
    for (const method in CURL_OPTIONS) {
        const key = CURL_OPTIONS[method].key;
        const value = _getParamValue(request, key);
        if (value) {
            if (method === 'data') {
                try {
                    const isJson = value.match(/^\s*[\{\[]/);
                    result[method] = isJson ? JSON.parse(value) : value;
                } catch (e: any) {
                    LOG.WARN(`Failed to parse JSON data: ${e.message}`);
                    result[method] = '';
                }
            } else {
                result[method] = value;
            }
        }
    }
    return result;
};

/**
 * 🎯 Executes a curl command with the specified URL and options.
 * @param {URI} url ➡️ The URL to send the curl request to.
 * @param {CURL_OPTS} options ➡️ The curl options to include in the request.
 * @returns {string} 📤 The raw response from the curl command.
 */
export const curl = (url: URI, options: CURL_OPTS): string => {
    const defaultOpts: CURL_OPTS = {
        silent: true,
        timeout: 0,
    };
    const allOpts = { ...defaultOpts, ...options };
    const params = _setParams(url, allOpts);
    const uri = allOpts.noEncode === true ? url : encodeURI(url);
    const finalCommand = `curl ${params} -i "${uri}"`;
    const rawData: string = command(finalCommand);
    return rawData;
};

// export types
export type { CURL_ITEM, CURL_OPTS } from './index.d';
