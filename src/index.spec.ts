/**
 * 🧪 testing module
 * @version 1.0.0
 * @date 2026-09-23
 * @license MIT
 * @author Robert Willemelis <github.com/willi84>
 */
import { sample } from './index';

describe('@robert.tools/curl', () => {
    it('should return a curl string', () => {
        expect(sample('hello')).toBe('sample: hello');
    });

    it('should return a curl string with empty input', () => {
        expect(sample('')).toBe('sample: ');
    });
});
