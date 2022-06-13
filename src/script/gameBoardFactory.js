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

		for (let index = 0; index < ship.length; index += 1) {
			let currentCell;
			if (orientation === 'horizontal')
				currentCell = cell[coords[0] + index][coords[1]];
			if (orientation === 'vertical')
				currentCell = cell[coords[0]][coords[1] + index];
			currentCell.occupancy.occupied = 1;
			currentCell.occupancy.ship = ship;
			currentCell.occupancy.shipSegment = index;
		}
	}

	return { cell, ships, placeShip };
};
