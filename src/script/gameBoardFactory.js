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
		};

		const cells = new Array(size).fill(0).map(() => Array(size).fill(0));

		for (let i = 0; i < size; i += 1) {
			for (let j = 0; j < size; j += 1) {
				cells[i][j] = JSON.parse(JSON.stringify(initialContent)); // deep copy object
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

	function _markValidPlacement(ship, coords, orientation) {
		for (let index = 0; index < ship.length; index += 1) {
			let currentCell;
			if (orientation === 'horizontal')
				currentCell = cell[coords[0] + index][coords[1]];
			if (orientation === 'vertical')
				currentCell = cell[coords[0]][coords[1] + index];
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
