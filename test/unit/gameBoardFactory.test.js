/* eslint-disable jest/no-done-callback */
import PubSub from 'pubsub-js';
import gameBoardFactory from '../../src/script/gameBoardFactory';
import shipFactory from '../../src/script/shipFactory';

describe('gameBoard Tests', () => {
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
	});

	describe.skip('Ship placement errors', () => {
		const testBoard = gameBoardFactory(10);
		testBoard.placeShip(shipFactory(4), [0, 0], 'horizontal');
		testBoard.placeShip(shipFactory(2), [7, 7], 'vertical');

		it('doesnt place ships ouside of borders', () => {
			const errorMessage = 'Placement is outside of borders';
			expect(() =>
				testBoard.placeShip(shipFactory(4), [12, 12], 'horizontal')
			).toThrowError(errorMessage);
			expect(() =>
				testBoard.placeShip(shipFactory(4), [8, 8], 'horizontal')
			).toThrowError(errorMessage);
			expect(() =>
				testBoard.placeShip(shipFactory(4), [0, 6], 'vertical')
			).not.toThrowError(errorMessage);
		});

		it('doesnt place ships on/near other ships', () => {
			const errorMessage = 'Placement is too close to other ships';
			expect(() =>
				testBoard.placeShip(shipFactory(2), [1, 1], 'horizontal')
			).toThrowError(errorMessage);
			expect(() =>
				testBoard.placeShip(shipFactory(2), [6, 6], 'vertical')
			).toThrowError(errorMessage);
			expect(() =>
				testBoard.placeShip(shipFactory(2), [6, 6], 'horizontal')
			).toThrowError(errorMessage);
			expect(() =>
				testBoard.placeShip(shipFactory(2), [9, 8], 'vertical')
			).not.toThrowError(errorMessage);
		});
	});

	describe('receive hit at location tests', () => {
		const testBoard = gameBoardFactory(10);
		testBoard.placeShip(shipFactory(4), [0, 0], 'horizontal');
		testBoard.placeShip(shipFactory(2), [7, 7], 'vertical');

		const placementValidityMap = new Array(10)
			.fill(2)
			.map(() => Array(10).fill(2));
		for (let i = 0; i < 10; i += 1) {
			for (let j = 0; j < 10; j += 1) {
				placementValidityMap[i][j] = testBoard.cell[i][j].wasHit;
			}
		}

		it('records hit locations', () => {
			testBoard.receiveAttack([5, 5]);
			expect(testBoard.cell[5][5].wasHit).toBe(1);
			testBoard.receiveAttack([9, 9]);
			expect(testBoard.cell[5][5].wasHit).toBe(1);
		});
		it('transfers hits to ships in array', () => {
			testBoard.receiveAttack([0, 0]);
			testBoard.receiveAttack([2, 0]);
			testBoard.receiveAttack([7, 7]);
			testBoard.receiveAttack([7, 8]);
			expect(testBoard.ships[0].status).toEqual([
				true,
				false,
				true,
				false,
			]);
			expect(testBoard.ships[1].status).toEqual([true, true]);
		});

		it.skip('throws on already hit locations', () => {
			const errorMessage = 'Location already hit';
			expect(() => testBoard.receiveAttack([0, 0])).toThrowError(
				errorMessage
			);
		});

		it('throws on out of bounds locations', () => {
			const errorMessage = 'Hit attempt ouside of bounds';
			expect(() => testBoard.receiveAttack([10, 10])).toThrowError(
				errorMessage
			);
		});
	});

	describe('Board reports events', () => {
		const testBoard = gameBoardFactory(10);
		testBoard.placeShip(shipFactory(4), [0, 0], 'horizontal');
		testBoard.placeShip(shipFactory(2), [7, 7], 'vertical');
		testBoard.receiveAttack([5, 8]);

		it('report ship placement outside of borders', (done) => {
			const expectedMessage = testBoard.messages.shipPlacement.msg[0];
			expect.assertions(1);
			const testSubscriber = (topic, message) => {
				try {
					expect(message).toBe(expectedMessage);
					done();
				} catch (error) {
					done(error);
				}
			};

			PubSub.subscribe(
				testBoard.messages.shipPlacement.topic,
				testSubscriber
			);
			testBoard.placeShip(shipFactory(2), [9, 0], 'horizontal');
		});

		it('report ship placement too close to other ships', (done) => {
			const expectedMessage = testBoard.messages.shipPlacement.msg[1];
			expect.assertions(1);
			const testSubscriber = (topic, message) => {
				try {
					expect(message).toBe(expectedMessage);
					done();
				} catch (error) {
					done(error);
				}
			};

			PubSub.subscribe(
				testBoard.messages.shipPlacement.topic,
				testSubscriber
			);
			testBoard.placeShip(shipFactory(2), [0, 1], 'horizontal');
		});

		it('reports successful ship placement', (done) => {
			const expectedMessage = testBoard.messages.shipPlacement.msg[2];
			expect.assertions(1);
			const testSubscriber = (topic, message) => {
				try {
					expect(message).toBe(expectedMessage);
					done();
				} catch (error) {
					done(error);
				}
			};

			PubSub.subscribe(
				testBoard.messages.shipPlacement.topic,
				testSubscriber
			);
			testBoard.placeShip(shipFactory(2), [0, 2], 'horizontal');
		});

		it('reports already hit locations', (done) => {
			const expectedMessage = testBoard.messages.hits.msg[1];
			expect.assertions(1);
			const testSubscriber = (topic, message) => {
				try {
					expect(message).toBe(expectedMessage);
					done();
				} catch (error) {
					done(error);
				}
			};

			PubSub.subscribe(testBoard.messages.hits.topic, testSubscriber);
			testBoard.receiveAttack([5, 8]);
		});

		it('reports succsessful hits', (done) => {
			const expectedMessage = testBoard.messages.hits.msg[2];
			expect.assertions(1);
			const testSubscriber = (topic, message) => {
				try {
					expect(message).toBe(expectedMessage);
					done();
				} catch (error) {
					done(error);
				}
			};

			PubSub.subscribe(testBoard.messages.hits.topic, testSubscriber);
			testBoard.receiveAttack([2, 0]);
		});

		it('reports missed hits', (done) => {
			const expectedMessage = testBoard.messages.hits.msg[3];
			expect.assertions(1);
			const testSubscriber = (topic, message) => {
				try {
					expect(message).toBe(expectedMessage);
					done();
				} catch (error) {
					done(error);
				}
			};

			PubSub.subscribe(testBoard.messages.hits.topic, testSubscriber);
			testBoard.receiveAttack([2, 2]);
		});

		it.todo('reports ship that is sunk after last hit on it');
		it.todo('reports that all ships are sunk');
	});

	describe('Reports sunk ships', () => {
		const testBoard = gameBoardFactory(10);
		testBoard.placeShip(shipFactory(4), [0, 0], 'horizontal');
		testBoard.placeShip(shipFactory(2), [7, 7], 'vertical');
		testBoard.receiveAttack([0, 0]);
		testBoard.receiveAttack([1, 0]);
		testBoard.receiveAttack([2, 0]);

		it('Reports sunk ships', (done) => {
			const expectedMessage = testBoard.messages.sunkShips.msg[0];
			expect.assertions(1);
			const testSubscriber = (topic, message) => {
				try {
					expect(message).toBe(expectedMessage);
					done();
				} catch (error) {
					done(error);
				}
			};

			PubSub.subscribe(
				testBoard.messages.sunkShips.topic,
				testSubscriber
			);
			testBoard.receiveAttack([3, 0]);
		});
	});

	describe('Reports win condition', () => {
		const testBoard = gameBoardFactory(10);
		testBoard.placeShip(shipFactory(4), [0, 0], 'horizontal');
		testBoard.placeShip(shipFactory(2), [7, 7], 'vertical');
		testBoard.receiveAttack([0, 0]);
		testBoard.receiveAttack([1, 0]);
		testBoard.receiveAttack([2, 0]);
		testBoard.receiveAttack([3, 0]);
		testBoard.receiveAttack([7, 7]);

		it.only('Reports win condition', (done) => {
			const expectedMessage = testBoard.messages.winCondition.msg[0];
			expect.assertions(1);
			const testSubscriber = (topic, message) => {
				try {
					expect(message).toBe(expectedMessage);
					done();
				} catch (error) {
					done(error);
				}
			};

			PubSub.subscribe(
				testBoard.messages.winCondition.topic,
				testSubscriber
			);
			testBoard.receiveAttack([7, 8]);
		});
	});
});
