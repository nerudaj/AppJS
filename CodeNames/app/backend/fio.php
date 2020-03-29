<?php
/** Terminology:
 *  Field           - 32-bit integer representation of the game state
 *  Game            - a stored instance of a field
 *  Started game    - a game whose field is != GAME_FIELD_EMPTY
 *                    (A started game with no card flipped can be indicated by setting one of the unused bits (26th LSB suggested))
 *  Active game     - a started game which is younger than MIN_GAME_TIME_TO_DELETE (age is measured from the last field change)
 *  Inactive game   - a game whose field is == GAME_FIELD_EMPTY or a started game older than MIN_GAME_TIME_TO_DELETE
 *  Old game        - a game that is older than MAX_GAME_TIME_TO_DELETE
 */

define("MAX_GAME_FILES",  20); //max files in directory (not used yet)
define("MAX_ACTIVE_GAMES", 10); //max concurrent games
define("MIN_GAME_TIME_TO_DELETE", 60*45);  //time after which a started game can be deleted
define("MAX_GAME_TIME_TO_DELETE", 60*60*5); //time after a file will be deleted (in seconds)
define("GAME_FILES_PATH", "games"); // path to the folder with stored games

// field state defines
define("GAME_FIELD_EMPTY", 0x00000000); // no bit set
define("ERROR_CANNOT_CREATE_GAME", 0x80000000); // first MSB set
define("ERROR_GAME_NOT_FOUND", 0x40000000); // second MSB set

/**
 * Returns value with bit at index set to 1
 *
 * @param integer $value value to be altered
 * @param integer $index position of the bit to be set (0 = LSB)
 * @return integer the value $value with bit at $index set to 1
 */
function setBit($value, $index) {
	return $value |= 1 << $index;
}

/**
 * Returns value with bit at index set to 0
 *
 * @param integer $value value to be altered
 * @param integer $index position of the bit to be cleared (0 = LSB)
 * @return integer the value $value with bit at $index set to 0
 */
function clearBit($value, $index) {
	return $value &= ~(1 << $index);
}

/**
 * Deletes given files from disk
 *
 * @param array $list list of strings of paths to files to be deleted
 * @return NULL
 */
function deleteFiles($list) {
	foreach ($list as $file) {
		unlink($file);
	}
}

function isOldGame($age) {
	return $age > MAX_GAME_TIME_TO_DELETE;
}

function isStartedGame($filename) {
	return loadGameField($filename) != GAME_FIELD_EMPTY;
}

function isInactiveGame($age, $filename) {
	return $age > MIN_GAME_TIME_TO_DELETE or !isStartedGame($filename);
}

/**
 * Fills the provided arrays with paths to stored games
 *
 * @param array &$old_games will contain paths to games that are older than defined
 * @param array &$active_games will contain paths to games that are active
 * @param array &$inactive_games will contain paths to games that are inactive
 * @param array &$inactive_times will contain integer timestamps of games in &$inactive_games
 */
function getGames(&$old_games, &$active_games, &$inactive_games, &$inactive_times){
	if (!is_dir(GAME_FILES_PATH)) {
		mkdir(GAME_FILES_PATH);
	}

	$files = scandir(GAME_FILES_PATH);
	$count_files = count($files) - 2; // skip folders . and ..
	$now = time();

	for ($i = 2; $i < $count_files + 2; $i++) {
		$filename = GAME_FILES_PATH."/".$files[$i];
		$filetime = filemtime($filename);
		$age = $now - $filetime;

		if (isOldGame($age)) {
			$old_games[] = $filename;
		} elseif (isInactiveGame($age, $filename)) {
			$inactive_games[] = $filename;
			$inactive_times[] = $filetime;
		} else {
			$active_games[] = $filename;
		}
	}
}

/**
 * Return true if new game field can be created else return false
 *
 * @return boolean true if new game can be created, else false
 */
function checkFolder() {
	$old_games = array();
	$inactive_games = array();
	$inactive_times = array();
	$active_games = array();

	getGames($old_games, $active_games, $inactive_games, $inactive_times);
	deleteFiles($old_games);

	$count_active = count($active_games);
	if ($count_active >= MAX_ACTIVE_GAMES) {
		return False;
	}

	// delete all inactive games until there is less than max games
	while ($count_active + count($inactive_times) >= MAX_ACTIVE_GAMES) {
		$oldest_inactive_index = array_search(min($inactive_times), $inactive_times);
		unlink($inactive_games[$oldest_inactive_index]); // delete from disk
		unset($inactive_times[$oldest_inactive_index]); // remove date from array
	}
	return True;
}

function getFilenameFromGameId($gameId) {
	return GAME_FILES_PATH . "/" . $gameId . ".txt";
}

function loadGameField($filename) {
	return file_get_contents($filename);
}

function saveGameField($filename, $field) {
	file_put_contents($filename, $field);
}

/**
 * Returns the current state of the field or creates new one
 * if it does not exist and returns that. Returns an error code otherwise.
 * If the field cannot be created, returns an errror code ERROR_CANNOT_CREATE_GAME
 *
 * @param string $gameid ID of the game
 * @return integer 32-bit representation of the field
 */
function getField($gameid) {
	$filename = getFilenameFromGameId($gameid);
	$field = GAME_FIELD_EMPTY; // 32 bit integer

	if (!file_exists($filename)) {
		if (!checkFolder()) {
			return ERROR_CANNOT_CREATE_GAME;
		}
		saveGameField($filename, $field);
	}

	$field = loadGameField($filename);
	return $field;
}

/**
 * Sets an index of the game to a value and returns the new state of filed.
 * If $gameid does not exist, returns ERROR_GAME_NOT_FOUND
 *
 * @param string $gameid ID of the game
 * @param integer $index index of the target value
 * @param boolean $value the new value at the target index (default = 1)
 * @return integer 32-bit representation of the field
 */
function setField($gameid, $index, $value=1) {
	$filename = getFilenameFromGameId($gameid);
	if (!file_exists($filename)) {
		return ERROR_GAME_NOT_FOUND;
	}

	$field = loadGameField($filename);
	if ($value) {
		$field = setBit($field, $index);
	} else {
		$field = clearBit($field, $index);
	}

	saveGameField($filename, $field);
	return $field;
}

?>