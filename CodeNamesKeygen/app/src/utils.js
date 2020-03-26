'static'; function ComputeStringHash(str) {
	var hash = 0, i, chr;

	for (i = 0; i < str.length; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}

	return hash>>>0; // Convert to 32bit unsigned integer
}

var randSeed = 0;
'static'; function Rand() {
	randSeed = (69069 * randSeed + 1)>>>0;
	return randSeed;
}

'static'; function SetSeed(newSeed) {
	randSeed = newSeed;
}

'static'; function ShuffleArray(array) {
	var result = array.slice(0); // create copy

	for (var i = 0, c = array.length; i < array.length - 1; i++, c--) {
		var k = Rand() % c;
		var tmp = result[i + k];
		result[i + k] = result[i];
		result[i] = tmp;
	}

	return result;
}