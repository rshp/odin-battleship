/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import PubSub from 'pubsub-js';

export default (boardSize) => {
	function boardInit(size) {
		const initialContent = {
			occupancy: {
				occupied: 0,
				ship: null,
				shipSegment: null,
			},
			wasHit: 0,
			validForPlacement: 1,
			boardCoordinates: {
				x: null,
				y: null,
			},
		};

		const cells = new Array(size).fill(0).map(() => Array(size).fill(0));

		for (let i = 0; i < size; i += 1) {
			for (let j = 0; j < size; j += 1) {
				cells[i][j] = JSON.parse(JSON.stringify(initialContent)); // deep copy object
				cells[i][j].boardCoordinates = {
					x: i,
					y: j,
				};
			}
		}
		return cells;
	}

	const cell = boardInit(boardSize);
	const ships = [];

	function placeShip(ship, coords, orientation) {
		if (_isOutsideOfBorders(ship, coords, orientation)) {
			PubSub.publish(
				messages.shipPlacement.topic,
				messages.shipPlacement.msg[0]
			);
			return;
		}
		if (_isInsideInvalidZone(ship, coords, orientation)) {
			PubSub.publish(
				messages.shipPlacement.topic,
				messages.shipPlacement.msg[1]
			);
			return;
		}
		ships.push(ship);
		const shipCells = _selectShipCells(ship, coords, orientation);
		_markCellsOccupancy(shipCells, ship);
		_markValidPlacement(shipCells);
		PubSub.publish(
			messages.shipPlacement.topic,
			messages.shipPlacement.msg[2]
		);
	}

	function _isOutsideOfBorders(ship, coords, orientation) {
		if (
			coords[0] < 0 ||
			coords[1] < 0 ||
			coords[0] > boardSize - 1 ||
			coords[1] > boardSize - 1
		)
			return true;
		if (orientation === 'horizontal' && coords[0] + ship.length > boardSize)
			return true;
		if (orientation === 'vertical' && coords[1] + ship.length > boardSize)
			return true;
		return false;
	}

	function _isInsideInvalidZone(ship, coords, orientation) {
		const shipCells = _selectShipCells(ship, coords, orientation);
		return shipCells.some((shipCell) => shipCell.validForPlacement === 0);
	}

	function _markValidPlacement(shipCells) {
		shipCells.forEach((item) => {
			_markCellsAround(item);
		});
	}

	function _markCellsAround(currentCell) {
		const [x, y] = [
			currentCell.boardCoordinates.x,
			currentCell.boardCoordinates.y,
		];

		if (x > 0) {
			cell[x - 1][y].validForPlacement = 0;
			if (y > 0) {
				cell[x][y - 1].validForPlacement = 0;
				cell[x - 1][y - 1].validForPlacement = 0;
			}
			if (y < boardSize - 1) {
				cell[x][y + 1].validForPlacement = 0;
				cell[x - 1][y + 1].validForPlacement = 0;
			}
		}

		if (x < boardSize - 1) {
			cell[x + 1][y].validForPlacement = 0;
			if (y > 0) {
				cell[x][y - 1].validForPlacement = 0;
				cell[x + 1][y - 1].validForPlacement = 0;
			}
			if (y < boardSize - 1) {
				cell[x][y + 1].validForPlacement = 0;
				cell[x + 1][y + 1].validForPlacement = 0;
			}
		}
	}

	function _selectShipCells(ship, coords, orientation) {
		const selectedCells = [];
		for (let i = 0; i < ship.length; i += 1) {
			if (orientation === 'horizontal')
				selectedCells.push(cell[coords[0] + i][coords[1]]);
			if (orientation === 'vertical')
				selectedCells.push(cell[coords[0]][coords[1] + i]);
		}
		return selectedCells;
	}

	function _markCellsOccupancy(shipCells, ship) {
		shipCells.forEach((item, index) => {
			// eslint-disable-next-line no-param-reassign
			item.occupancy.occupied = 1;
			// eslint-disable-next-line no-param-reassign
			item.occupancy.ship = ship;
			// eslint-disable-next-line no-param-reassign
			item.occupancy.shipSegment = index;
		});
	}

	function receiveAttack(coords) {
		if (
			coords[0] < 0 ||
			coords[1] < 0 ||
			coords[0] > boardSize - 1 ||
			coords[1] > boardSize - 1
		) {
			throw new Error('Hit attempt ouside of bounds');
		}
		const targetCell = cell[coords[0]][coords[1]];
		if (targetCell.wasHit) {
			PubSub.publish(
				messages.hits.topic,
				messages.hits.msg[1] // report already hit
			);
			return;
		}
		targetCell.wasHit = 1;
		if (!targetCell.occupancy.occupied) {
			PubSub.publish(
				messages.hits.topic,
				messages.hits.msg[3] // report hit miss
			);
			return;
		}
		if (targetCell.occupancy.occupied) {
			targetCell.occupancy.ship.hit(targetCell.occupancy.shipSegment);
			PubSub.publish(messages.hits.topic, messages.hits.msg[2]); // report hit ship
			_checkShipSunk(targetCell.occupancy.ship);
		}
	}

	function _checkShipSunk(ship) {
		if (ship.isSunk()) {
			PubSub.publish(messages.sunkShips.topic, messages.sunkShips.msg[0]);
			_checkWinCondition();
		}
	}
	function _checkWinCondition() {
		const allShipsSunk = ships.every((ship) => ship.isSunk());
		if (allShipsSunk) {
			PubSub.publish(
				messages.winCondition.topic,
				messages.winCondition.msg[0]
			);
		}
	}

	const messages = {
		shipPlacement: {
			topic: 'SHIP_PLACEMENT',
			msg: [
				'Placement is outside of borders',
				'Placement is too close to other ships',
				'Placement sucsessful',
			],
		},
		hits: {
			topic: 'HITS_MESSAGE',
			msg: [
				'Invalid coordinates [unused]',
				'Location already hit',
				'Successful hit',
				'Missed hit',
			],
		},
		sunkShips: {
			topic: 'SUNK_SHIPS',
			msg: ['Ship sunk'],
		},
		winCondition: {
			topic: 'WIN_CONDITION',
			msg: ['All ships sunk'],
		},
	};

	return { cell, ships, placeShip, receiveAttack, messages };
};
