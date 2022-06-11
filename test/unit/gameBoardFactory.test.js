import gameBoardFactory from '../../src/script/gameBoardFactory';

describe('gameBoard Tests', () => {
	beforeAll(() => {});

	it('creates correct array that corresponds to gameboard', () => {
		const customBoard = gameBoardFactory(10);
	});
});
