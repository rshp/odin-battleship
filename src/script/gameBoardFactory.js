export default (boardSize) => {
	function boardInit(boardSize) {
		const initialContent = {
			occupancy: {
				occupied: 0,
				ship: null,
				shipSegment: null,
			},
			wasHit: 0,
			validForPlacement: 1,
		};

		const cells = new Array(boardSize)
			.fill(0)
			.map((x) => Array(boardSize).fill(0));

		for (let i = 0; i < boardSize; i += 1) {
			for (let j = 0; j < boardSize; j += 1) {
				cells[i][j] = JSON.parse(JSON.stringify(initialContent));
			}
		}
		return cells;
	}

	const cell = boardInit(boardSize);
	const ships = [];

	function placeShip(ship, coords, orientation) {
		ships.push(ship);
		if (orientation === 'horizontal') {
			for (let index = 0; index < ship.length; index += 1) {
				const currentCell = cell[coords[0] + index][coords[1]];
				currentCell.occupancy.occupied = 1;
				currentCell.occupancy.ship = ship;
				currentCell.occupancy.shipSegment = index;
			}
		}
		if (orientation === 'vertical') {
			for (let index = 0; index < ship.length; index += 1) {
				const currentCell = cell[coords[0]][coords[1] + index];
				currentCell.occupancy.occupied = 1;
				currentCell.occupancy.ship = ship;
				currentCell.occupancy.shipSegment = index;
			}
		}
	}
	return { cell, ships, placeShip };
};
