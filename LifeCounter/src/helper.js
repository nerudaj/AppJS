/**
 *  @brief Constructor of player data storage
 *
 *  @return Player object
 */
'static'; function ClassPlayer() {
	this.score = 0;
	this.subscore = 0;
	this.color = "red";
	this.$scoreHistory = '';
	this.$subscoreHistory = '';
}

/**
 *  @brief Convert integer time in seconds to string MM:SS reprezentation
 *
 *  @param [in] t Time in seconds
 *  @param [in] longfmt Whether hours should be part of the output
 *  @return String in format [H:]MM:SS
 */
'static'; function IntToTimeStr(t, longfmt = false) {
	var seconds = '0' + String(t % 60);
	var minutes = '0' + String(Math.floor(t / 60) % 60);
	var hours = String(Math.floor(t / 3600));
	return (longfmt ? hours.slice(-1) + ':' : '') + minutes.slice(-2) + ':' + seconds.slice(-2);
}

'static'; function Random(min, max) {
	return Math.floor((Math.random() * max) + min);
}

/**
 *  @brief Clear interval and return NULL as a new value for handle
 *
 *  @param [in] handle Interval ID handle
 *  @return NULL
 */
'static'; function ReallyClearInterval(handle) {
	clearInterval(handle);
	return null;
}
