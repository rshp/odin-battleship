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

		const board = new Array(boardSize).fill(
			new Array(boardSize).fill(initialContent)
		);
		return board;
	}

	const cell = boardInit(boardSize);
	const ships = [];

	return { cell, ships };
};
