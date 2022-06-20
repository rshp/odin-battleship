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
			const errorMessage = 'Placement is outside of borders';
			PubSub.publish(messageTopics.shipPlacementTopic, errorMessage);
			// throw new Error(errorMessage);
			return;
		}
		if (_isInsideInvalidZone(ship, coords, orientation)) {
			const errorMessage = 'Placement is too close to other ships';
			PubSub.publish(messageTopics.shipPlacementTopic, errorMessage);
			// throw new Error(errorMessage);
			return;
		}
		ships.push(ship);
		const shipCells = _selectShipCells(ship, coords, orientation);
		_markCellsOccupancy(shipCells, ship);
		_markValidPlacement(shipCells);
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
		)
			throw new Error('Hit attempt ouside of bounds');
		const targetCell = cell[coords[0]][coords[1]];
		if (targetCell.wasHit) throw new Error('Location already hit');
		targetCell.wasHit = 1;
		if (!targetCell.occupancy.occupied) {
			// report miss
		}
		if (targetCell.occupancy.occupied) {
			targetCell.occupancy.ship.hit(targetCell.occupancy.shipSegment);
			// report ship hit
		}
	}

	const messageTopics = {
		shipPlacementTopic: 'SHIP_PLACEMENT',
		hitsMessageTopic: 'HITS_MESSAGE',
		sunkShipsTopic: 'SUNK_SHIPS',
		winConditionTopic: 'WIN_CONDITION',
	};

	return { cell, ships, placeShip, receiveAttack, messageTopics };
};
