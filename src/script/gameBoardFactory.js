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
		//unfinished
	}

	function _markValidPlacement(shipCells) {
		shipCells.forEach((item) => {
			_markCellsAround(item, boardSize);
		});
	}

	function _markCellsAround(currentCell, boardSize) {
		const x = currentCell.boardCoordinates.x;
		const y = currentCell.boardCoordinates.y;
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
		shipCells.forEach((cell, index) => {
			cell.occupancy.occupied = 1;
			cell.occupancy.ship = ship;
			cell.occupancy.shipSegment = index;
		});
	}

	return { cell, ships, placeShip };
};
