export default (shipLength) => {
	if (!shipLength) throw new Error('invalid ship length');
	const length = shipLength;
	const status = new Array(length).fill(false);

	function isSunk() {
		return status.every((location) => location);
	}

	function hit(position) {
		if (position > length - 1) throw new Error('Hit outside of bounds');
		if (isSunk()) throw new Error('Already sunk');
		if (status[position]) throw new Error('Already hit at this position');
		status[position] = true;
	}

	return {
		length,
		status,
		isSunk,
		hit,
	};
};
