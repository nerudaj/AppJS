'static'; function SmoothStop(t) {
	return 1 - t * t;
}

/**
 *  @brief Generate synthetic tone
 *  
 *  @param [in] frequency Frequency of tone
 *  @param [in] length Length of tone (in seconds)
 *  @return Returns WAV file encoded in base64, you can directly set it as src of Audio object
 */
'static'; function GenerateTone(frequency, length) {
	var channels = 1;
	var sampleRate = 22050;
	var bitsPerSample = 8;
	
	var data = new Uint8Array(length * sampleRate);
	var T = sampleRate / frequency;
	
	for (var i = 0; i < data.length; i++) {
		data[i] = SmoothStop(i / data.length) * 126 * Math.sin(i * 2 * Math.PI / T) + 128;		
	}
	
	var out = [
		'RIFF',
		PackUint32(1, 4 + (8 + 24/* chunk 1 length */) + (8 + 8/* chunk 2 length */)), // Length
		'WAVEfmt ',
		// chunk 1 + sub-chunk identifier
		PackUint32(1, 16), // Chunk length
		PackUint32(0, 1), // Audio format (1 is linear quantization)
		PackUint32(0, channels),
		PackUint32(1, sampleRate),
		PackUint32(1, sampleRate * channels * bitsPerSample / 8), // Byte rate
		PackUint32(0, channels * bitsPerSample / 8),
		PackUint32(0, bitsPerSample),
		// chunk 2
		'data', // Sub-chunk identifier
		PackUint32(1, data.length * channels * bitsPerSample / 8), // Chunk length
		data
	];
	
	// Encode into base64. I didn't capture some ugly stuff in variable for space conservation purposes
	var blob = new window.Blob(out, {type: 'audio/wav'});
	var dataURI = (window.URL || window.webkitURL).createObjectURL(blob);
	
	return dataURI;
}

'static'; function PackUint32(c, arg) {
	return [new Uint8Array([arg, arg >> 8]), new Uint8Array([arg, arg >> 8, arg >> 16, arg >> 24])][c];
}