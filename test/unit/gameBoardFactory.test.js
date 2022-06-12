import gameBoardFactory from '../../src/script/gameBoardFactory';
import shipFactory from '../../src/script/shipFactory';

describe('gameBoard Tests', () => {
	beforeAll(() => {});

	describe('Board initialization tests', () => {
		it.todo('creates board array of correct size');
		it.todo('initializes each board cell with required objects');
		it.todo('initializes ships list');
	});

	describe('Ship placement tests', () => {
		it.todo(
			'places ship horizontally on board at specified coordinates and in ships list'
		);
		it.todo(
			'places ship vertically on board at specified coordinates and in ships list'
		);
		it.todo('doesnt place ships on/near other ships');
		it.todo('doesnt place ships ouside of borders');
	});

	describe('receive hit at location tests', () => {
		it.todo('records missed locations');
		it.todo('returns hits and misses');
		it.todo('transfers hits to ships in array');

		it.todo('throws on already hit locations');
		it.todo('throws on out of bounds locations');
	});

	describe('Board reports events', () => {
		it.todo('invalid ship placement attempt');
		it.todo('invalid hit placement attempt');
		it.todo('reports ship that is sunk after last hit on it');
		it.todo('reports that all ships are sunk');
	});
});
