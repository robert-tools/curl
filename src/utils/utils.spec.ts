import type { CURL_PARAMS } from '../index.d';
import {
    _setHeader,
    _getAllowedOption,
    _getParamValue,
    _iterateOptions,
    _setParam,
    _setParams,
    _setValue,
} from './utils';

describe('✅ _setHeader()', () => {
    it('should generate a curl header string', () => {
        const result = _setHeader('Authorization', 'some token');
        expect(result).toBe('-H "Authorization: some token"');
    });
    it('should generate a curl header string without colon', () => {
        const result = _setHeader('Authorization', 'some token', false);
        expect(result).toBe('-H "Authorization some token"');
    });
    it('should generate no curl header if not defined', () => {
        const result = _setHeader('', '');
        expect(result).toBe('');
    });
});
describe('✅ _iterateOptions', () => {
    const FN = _iterateOptions;
    const auth = 'Authorization';
    const ua = 'User-Agent';
    it('should iterate over curl options and generate the correct string', () => {
        const options = {
            ua: 'aUA',
            token: 'xyz',
            method: 'POST',
            silent: true,
            other: '   ', // should be trimmed
        };
        const OPTIONS: CURL_PARAMS = {
            ua: { key: ua, noColon: false }, // header options with colon
            token: { key: auth, noColon: true }, // header option without colon
            method: { key: 'X' }, // normal option
            silent: { key: 's', noValue: true }, // silent option
            other: { key: 'o' }, // other option
        };
        const result = FN(options, OPTIONS);
        expect(result).toEqual(` -H "${ua}: aUA" -H "${auth} xyz" -X POST -s `);
    });
});
describe('✅ _setParams()', () => {
    const FN = _setParams;
    const URL_GH = 'https://api.github.com/path';
    const URL_GL = 'https://gitlab.com/gitlab_path';
    const URL = 'https://example.com/path';
    const UA = `-H "User-Agent: nodejs"`;
    const ua = 'myUA';
    const UA_CUSTOM = `-H "User-Agent: ${ua}"`;
    const header = {};
    it('should add user-agents to command', () => {
        expect(FN(URL, {})).toEqual(`${UA}`);
        expect(FN(URL, { noUA: true })).toEqual(``);
        // expect(FN(URL, {})).toEqual(`-H "User-Agent: ${ua}"`);
        expect(FN(URL, { header: { ua } })).toEqual(`-H "User-Agent: myUA"`);
        expect(FN(URL_GH, {})).toEqual(''); // GitHub API should not include User-Agent header
        expect(FN(URL_GH, { header: { ua } })).toEqual(''); // GitHub API should not include User-Agent header
    });
    it('should add timeout to command', () => {
        expect(FN(URL, { timeout: 0.5 })).toEqual(`${UA} -m 0.5`);
        expect(FN(URL, { timeout: 5 })).toEqual(`${UA} -m 5`);
        expect(FN(URL, { timeout: 0 })).toEqual(`${UA}`);
    });
    it('should add forwarding as data value', () => {
        const opts = { forwarding: true };
        expect(FN(URL, opts)).toContain(`-d '{"forwarding":true}'`);
    });

    it('should add token to command', () => {
        const token = 'xyz';
        const UA = UA_CUSTOM;
        const opts = { header: { ua, token } };
        expect(FN(URL_GH, opts)).toEqual(`-H "Authorization: token ${token}"`);
        expect(FN(URL_GL, opts)).toEqual(`${UA} -H "PRIVATE-TOKEN: ${token}"`);
        expect(FN(URL, opts)).toEqual(`${UA}`); // no token
    });
    it('should add method to command', () => {
        expect(FN(URL, { method: 'POST', header })).toEqual(`${UA} -X POST`);
    });
});
describe('✅ _getParamValue()', () => {
    const FN = _getParamValue;
    it('should extract the value of a given curl parameter', () => {
        const curlCommand = `curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://example.com/path`;
        expect(FN(curlCommand, 'X')).toBe('POST');
        expect(FN(curlCommand, 'H')).toBe('Content-Type: application/json');
        expect(FN(curlCommand, 'd')).toBe('{"key":"value"}');
        expect(FN(curlCommand, 'nonexistent')).toBe('');
    });
});
describe('✅ _setValue()', () => {
    const FN = _setValue;
    it('should correctly format values with quotes', () => {
        expect(FN('simple', "'")).toBe('simple');
        expect(FN('with space', "'")).toBe(`'with space'`);
        expect(FN({ key: 'value' }, "'")).toBe(`'{"key":"value"}'`);
    });
    it('should correctly format values with filter keys', () => {
        const input = { key: 'value', extra: 'data' };
        expect(FN(input, "'", ['key'])).toBe(`'{"key":"value"}'`);
        expect(FN(input, "'", [])).toBe(`'{"key":"value","extra":"data"}'`);
    });
    it('should correctly format values different quote', () => {
        expect(FN('simple', '"')).toBe('simple');
        expect(FN('with space', '"')).toBe(`"with space"`);
        expect(FN({ key: 'value' }, '"')).toBe(`"{"key":"value"}"`);
    });
});
describe('✅ _getAllowedCurlOption()', () => {
    const FN = _getAllowedOption;
    it('should return the correct curl option key for valid keys', () => {
        expect(FN('method')).toBe('X');
        expect(FN('header')).toBe(undefined);
        expect(FN('ua')).toBe('H');
    });
    it('should return undefined for unsupported keys', () => {
        expect(FN('unsupported')).toBe(undefined);
    });
});
describe('✅ _setParam()', () => {
    const FN = _setParam;
    const json = { forwarding: 'value' };
    const json2 = { forwarding: true };
    const json3 = '{forwarding:true}';
    const json4 = '{ forwarding: true } ';
    it('should return the correct curl data parameter', () => {
        const value = 'forwarding: value';
        expect(FN('data', json)).toBe(` -d '{"forwarding":"value"}' `);
        expect(FN('data', json2)).toBe(` -d '{"forwarding":true}' `);
        expect(FN('data', json3)).toBe(` -d '${json3}' `);
        expect(FN('data', json4)).toBe(` -d '${json4}' `);
        expect(FN('data', 'forwarding: value')).toBe(` -d '${value}' `);
        expect(FN('data', {})).toBe('');
    });
    it('should return the method param in valid quotes', () => {
        expect(FN('method', 'POST')).toBe(` -X POST `);
        expect(FN('method', 'POST IN')).toBe(` -X 'POST IN' `);
        const strJSON = JSON.stringify(json);
        expect(FN('method', json)).toBe(` -X '${strJSON}' `);
    });
    it('should return empty string for unsupported keys', () => {
        expect(FN('unsupported', 'value')).toBe('');
    });
    it('should return empty string for null or undefined values', () => {
        expect(FN('data', null)).toBe('');
        expect(FN('data', undefined)).toBe('');
    });
});
