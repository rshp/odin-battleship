/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
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
		// if (_isOutsideOfBorders(ship, coords, orientation))
		// 	throw new Error('Placement is outside of borders');
		if (_isInsideInvalidZone(ship, coords, orientation))
			throw new Error('Placement is too close to other ships');

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

	return { cell, ships, placeShip };
};
