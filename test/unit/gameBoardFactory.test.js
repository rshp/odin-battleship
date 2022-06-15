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
			const cellContent1 = {
				occupancy: {
					occupied: 0,
					ship: null,
					shipSegment: null,
				},
				wasHit: 0,
				validForPlacement: 1,
				boardCoordinates: {
					x: 0,
					y: 0,
				},
			};
			const cellContent2 = {
				occupancy: {
					occupied: 0,
					ship: null,
					shipSegment: null,
				},
				wasHit: 0,
				validForPlacement: 1,
				boardCoordinates: {
					x: 9,
					y: 9,
				},
			};
			expect(testBoard.cell[0][0]).toEqual(cellContent1);
			expect(testBoard.cell[9][9]).toEqual(cellContent2);
			expect(testBoard.cell[5][9].boardCoordinates).toEqual({
				x: 5,
				y: 9,
			});
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

		const ship5 = shipFactory(2);
		const ship6 = shipFactory(3);
		const ship7 = shipFactory(4);
		const ship8 = shipFactory(5);

		testBoard.placeShip(ship4, [0, 0], 'horizontal');
		testBoard.placeShip(ship2, [2, 3], 'horizontal');
		testBoard.placeShip(ship3, [7, 9], 'horizontal');
		testBoard.placeShip(ship1, [0, 5], 'horizontal');

		testBoard.placeShip(ship5, [0, 2], 'vertical');
		testBoard.placeShip(ship6, [5, 0], 'vertical');
		testBoard.placeShip(ship7, [7, 4], 'vertical');
		testBoard.placeShip(ship8, [9, 3], 'vertical');

		const visualBoard = Array(10)
			.fill(0)
			.map(() => Array(10).fill(0));
		for (let i = 0; i < 10; i += 1) {
			for (let j = 0; j < 10; j += 1) {
				visualBoard[i][j] = testBoard.cell[i][j].occupancy.occupied;
			}
		}

		it('places ships in ships list', () => {
			expect(testBoard.ships.length).toBe(8);
			expect(testBoard.ships[0]).toBe(ship4);
			expect(testBoard.ships[1]).toBe(ship2);
			expect(testBoard.ships[2]).toBe(ship3);
			expect(testBoard.ships[7]).toBe(ship8);
		});

		it.each([
			[0, 0, ship4],
			[1, 0, ship4],
			[2, 0, ship4],
			[3, 0, ship4],

			[2, 3, ship2],
			[3, 3, ship2],

			[7, 9, ship3],
			[8, 9, ship3],
			[9, 9, ship3],

			[0, 5, ship1],
			[1, 5, ship1],
			[2, 5, ship1],
			[3, 5, ship1],
			[4, 5, ship1],
		])('at coords %i,%i ship is placed horizontally', (x, y, ship) => {
			expect(testBoard.cell[x][y].occupancy.occupied).toBe(1);
			expect(testBoard.cell[x][y].occupancy.ship).toBe(ship);
		});

		it.each([
			[0, 2, ship5],
			[0, 3, ship5],

			[5, 0, ship6],
			[5, 1, ship6],
			[5, 2, ship6],

			[7, 4, ship7],
			[7, 5, ship7],
			[7, 6, ship7],
			[7, 7, ship7],

			[9, 3, ship8],
			[9, 4, ship8],
			[9, 5, ship8],
			[9, 6, ship8],
		])('at coords %i,%i ship %i is placed vertically', (x, y, ship) => {
			expect(testBoard.cell[x][y].occupancy.occupied).toBe(1);
			expect(testBoard.cell[x][y].occupancy.ship).toBe(ship);
		});

		it.each([
			[0, 0, 0],
			[0, 1, 0],
			[2, 2, 0],
			[9, 9, 0],
			[9, 2, 0],
			[8, 3, 0],
			[6, 8, 0],
			[1, 2, 0],

			[7, 2, 1],
			[5, 7, 1],
			[9, 1, 1],
			[0, 7, 1],
		])('at coords %i,%i placement validity is %i', (x, y, expected) => {
			expect(testBoard.cell[x][y].validForPlacement).toBe(expected);
		});

		it.each([
			[0, 0, 0],
			[1, 0, 1],
			[2, 0, 2],
			[9, 9, 2],
			[9, 3, 0],
			[9, 7, 4],
			[7, 9, 0],
			[5, 0, 0],
			[5, 1, 1],
			[5, 2, 2],
		])('ship segment at %i, %i is %i', (x, y, segment) => {
			expect(testBoard.cell[x][y].occupancy.shipSegment).toBe(segment);
		});
		it.todo('doesnt place ships on/near other ships');
		it('doesnt place ships ouside of borders', () => {
			expect(() =>
				testBoard.placeShip(shipFactory(4), [12, 12], 'horizontal')
			).toThrow();
			expect(() =>
				testBoard.placeShip(shipFactory(4), [11, 3], 'horizontal')
			).toThrow();
			expect(() =>
				testBoard.placeShip(shipFactory(4), [7, 3], 'horizontal')
			).toThrow();
			expect(() =>
				testBoard.placeShip(shipFactory(4), [6, 3], 'horizontal')
			).not.toThrow();
			expect(() =>
				testBoard.placeShip(shipFactory(3), [6, 7], 'vertical')
			).not.toThrow();
			expect(() =>
				testBoard.placeShip(shipFactory(4), [3, 7], 'vertical')
			).toThrow();
		});
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
