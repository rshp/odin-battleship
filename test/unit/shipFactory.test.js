import shipFactory from '../../src/script/shipFactory';

describe('shipFactory creates ships correctly', () => {
	beforeAll(() => {});

	it('creates new ships correctly (unhit)', () => {
		const ship = shipFactory(3);
		expect(ship.length).toEqual(3);
	});

	it('hits handles ship hits #1', () => {
		const ship = shipFactory(4);
		ship.hit(0);
		ship.hit(3);
		expect(ship.status).toEqual([true, false, false, true]);
	});

	it('hits handles ship hits #2', () => {
		const ship = shipFactory(2);
		ship.hit(0);
		expect(ship.status).toEqual([true, false]);
	});

	it('throws if hit arg>ship length', () => {
		const ship = shipFactory(3);
		expect(() => {
			ship.hit(3);
		}).toThrow();
	});

	it('throws on hitting already hit positions', () => {
		const ship = shipFactory(3);
		ship.hit(0);
		ship.hit(2);
		expect(() => {
			ship.hit(0);
		}).toThrow();
	});

	it('throws on hitting already sunk ship', () => {
		const ship = shipFactory(4);
		ship.hit(0);
		ship.hit(3);
		ship.hit(1);
		ship.hit(2);
		expect(() => {
			ship.hit(1);
		}).toThrow();
	});

	it('reports sunk ships correctly #1', () => {
		const ship = shipFactory(4);
		ship.hit(0);
		ship.hit(3);
		ship.hit(1);
		ship.hit(2);
		expect(ship.isSunk()).toBeTruthy();
	});

	it('reports sunk ships correctly #2', () => {
		const ship = shipFactory(4);
		ship.hit(0);
		ship.hit(3);
		ship.hit(2);
		expect(ship.isSunk()).toBeFalsy();
	});

	it('throws on incorrect input for factory', () => {
		expect(() => {
			shipFactory(0);
		}).toThrow();
	});
});
