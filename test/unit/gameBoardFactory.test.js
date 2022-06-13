import gameBoardFactory from '../../src/script/gameBoardFactory';
import shipFactory from '../../src/script/shipFactory';

describe('gameBoard Tests', () => {
	beforeAll(() => {});

	describe('Board initialization tests', () => {
		it.each([[10], [15]])('creates board array of correct size', (a) => {
			const testBoard = gameBoardFactory(a);
			expect(testBoard.cell[0].length).toBe(a);
			expect(testBoard.cell[a - 1].length).toBe(a);
		});
		it('initializes each board cell with required objects', () => {
			const testBoard = gameBoardFactory(10);
			const cellContent = {
				occupancy: {
					occupied: 0,
					ship: null,
					shipSegment: null,
				},
				wasHit: 0,
				validForPlacement: 1,
			};
			expect(testBoard.cell[0][0]).toEqual(cellContent);
			expect(testBoard.cell[9][9]).toEqual(cellContent);
		});
		it('initializes ships list', () => {
			const testBoard = gameBoardFactory(10);
			expect(testBoard.ships).toEqual([]);
		});
	});

	describe('Ship placement tests', () => {
		beforeAll(() => {});
		const testBoard = gameBoardFactory(10);
		const ship1 = shipFactory(5);
		const ship2 = shipFactory(2);
		const ship3 = shipFactory(3);
		const ship4 = shipFactory(4);
		testBoard.placeShip(ship4, [0, 0], 'horizontal');

		const visualBoard = Array(10)
			.fill(0)
			.map(() => Array(10).fill(0));
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				visualBoard[i][j] = testBoard.cell[i][j].occupancy.shipSegment;
			}
		}

		testBoard.placeShip(ship2, [2, 3], 'horizontal');
		// testBoard.placeShip(ship3, [7, 9], 'horizontal');
		// testBoard.placeShip(ship1, [0, 5], 'horizontal');

		it.skip('places ships in ships list', () => {
			expect(testBoard.ships.length).toBe(4);
			expect(testBoard.ships[0]).toBe(ship4);
			expect(testBoard.ships[1]).toBe(ship2);
			expect(testBoard.ships[2]).toBe(ship3);
		});

		it.each([
			[0, 0, ship4],
			[1, 0, ship4],
			[2, 0, ship4],
			[3, 0, ship4],

			[2, 3, ship2],
			[3, 3, ship2],

			// [7, 9, ship3],
			// [8, 9, ship3],
			// [9, 9, ship3],

			// [0, 5, ship1],
			// [1, 5, ship1],
			// [2, 5, ship1],
			// [3, 5, ship1],
			// [4, 5, ship1],
		])('at coords %i,%i ship is placed horizontally', (x, y, ship) => {
			expect(testBoard.cell[x][y].occupancy.occupied).toBe(1);
			expect(testBoard.cell[x][y].occupancy.ship).toBe(ship);
		});

		it.todo('at coords %i,%i ship %i is placed vertically');
		it.todo('no place zone is correct around ship %i');
		it.todo('ship# %i segments are placed correctly');
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
