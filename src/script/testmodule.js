console.log('im in imported module');

function sum(a, b) {
	return a + b;
}

console.log(sum(4, 2));

const imATestConst = 42;

export { sum, imATestConst };
