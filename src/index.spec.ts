// external dependencies
import * as cmd from '@robert.tools/cmd';

// internal dependencies
import { curl, getCurlData } from './index';

describe('✅ getCurlData()', () => {
    const FN = getCurlData;
    const URL = 'https://example.com/path';
    const data = `{"key":"value"}`;
    it('should extract JSON data from curl command', () => {
        const type = 'Content-Type: application/json';
        const curlCommand = `curl -X POST -H "${type}" -d '${data}' ${URL}`;
        const result = FN(curlCommand);
        expect(result).toEqual({ data: JSON.parse(data), method: 'POST' });
    });
    it('should return empty object for invalid JSON', () => {
        const invalidData = '{key:"value"}';
        const curlCommand = `curl -X POST -d '${invalidData}' ${URL}`;
        const result = FN(curlCommand);
        expect(result).toEqual({ data: '', method: 'POST' });
    });
    it('should return non-json data as is', () => {
        const nonJsonData = 'key=value';
        const curlCommand = `curl -X POST -d '${nonJsonData}' ${URL}`;
        const result = FN(curlCommand);
        expect(result).toEqual({ data: nonJsonData, method: 'POST' });
    });
    it('should return empty object if no data is provided', () => {
        const curlCommand = `curl ${URL}`;
        const result = FN(curlCommand);
        expect(result).toEqual({});
    });
});

describe('✅ curl()', () => {
    const FN = curl;
    let spy: jest.SpyInstance;
    it('should return the raw curl command output', () => {
        spy = jest.spyOn(cmd, 'command').mockImplementation((): string => {
            return 'test';
        });
        const url = 'domain-200.de';
        const options = { method: 'GET' };
        const result = FN(url, options);
        const EXPECTED = `curl -H "User-Agent: nodejs" -X GET -s -i "domain-200.de"`;
        expect(spy).toHaveBeenCalledWith(EXPECTED);
        expect(result).toBe('test');
        spy.mockRestore();
    });
    it('should not encode the uri', () => {
        spy = jest.spyOn(cmd, 'command').mockImplementation((): string => {
            return 'test';
        });
        const url = 'https://example.com/path with spaces';
        expect(FN(url, { noEncode: true, noUA: true })).toEqual('test');
        const EXPECTED = `curl -s -i "${url}"`;
        expect(spy).toHaveBeenCalledWith(EXPECTED);
        spy.mockRestore();
    });
});
