import { sum } from '../../src/script/testmodule';

test('D', () => {
	expect(sum(1, 2)).toBe(3);
	expect(sum(2, 2)).toBe(4);
});
