<?php
/** Terminology:
 *  Field           - 32-bit integer representation of the game state
 *  Game            - a stored instance of a field
 *  Started game    - a game whose field is != CN_FIELD_EMPTY
 *                    (A started game with no card flipped can be indicated by setting one of the unused bits (26th LSB suggested))
 *  Active game     - a started game which is younger than CN_MIN_TIME_TO_DELETE (age is measured from the last field change)
 *  Inactive game   - a game whose field is == CN_FIELD_EMPTY or a started game older than CN_MIN_TIME_TO_DELETE
 *  Old game        - a game that is older than CN_MAX_TIME_TO_DELETE
 */

define("CN_MAX_FILES",  20); //max files in directory (not used yet)
define("CN_MAX_ACTIVE_GAMES", 10); //max concurrent games
define("CN_MIN_TIME_TO_DELETE", 60*45);  //time after which a started game can be deleted
define("CN_MAX_TIME_TO_DELETE", 60*60*24); //time after a file will be deleted
define("CN_FILE_PATH", "games"); // path to the folder with stored games

// field state defines
define("CN_FIELD_EMPTY", 0x00000000); // no bit set
define("CN_FIELD_FULL", 0x01FFFFFF); // lower 25 bits set
define("CN_FIELD_ERR_CANNOT_CREATE", 0x80000000); // first MSB set
define("CN_FIELD_ERR_NOT_FOUND", 0x40000000); // second MSB set

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

/** 
 * Fills the provided arrays with paths to stored games
 * 
 * @param array &$old_games will contain paths to games that are older than defined
 * @param array &$active_games will contain paths to games that are active
 * @param array &$inactive_games will contain paths to games that are inactive
 * @param array &$inactive_times will contain integer timestamps of games in &$inactive_games
 */
function getGames(&$old_games, &$active_games, &$inactive_games, &$inactive_times){
    if (!is_dir(CN_FILE_PATH)) {
        mkdir(CN_FILE_PATH);
    }
    $files = scandir(CN_FILE_PATH);
    $count_files = count($files) - 2;
    $now = time();
    for ($i = 2; $i<$count_files + 2; $i++) {
        $filename = CN_FILE_PATH."/".$files[$i];
        $filetime = filemtime($filename);
        $age = $now - $filetime;
        if ($age > CN_MAX_TIME_TO_DELETE) {
            $old_games[] = $filename;
        } elseif ($age > CN_MIN_TIME_TO_DELETE or file_get_contents($filename) != CN_FIELD_EMPTY) {
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
    if ($count_active >= CN_MAX_ACTIVE_GAMES) {
        return False;
    }

    // delete all inactive games until there is less than max games
    while ($count_active + count($inactive_times) >= CN_MAX_ACTIVE_GAMES) {
        $oldest_inactive_index = array_search(min($inactive_times), $inactive_times);
        unlink($inactive_games[$oldest_inactive_index]); // delete from disk
        unset($inactive_times[$oldest_inactive_index]); // remove date from array
    }
    return True;
}


/**
 * Returns the current state of the field or creates new one
 * if it does not exist and returns that. Returns an error code otherwise.
 * If the field cannot be created, returns an errror code CN_FIELD_ERR_CANNOT_CREATE
 * 
 * @param string $gameid ID of the game
 * @return integer 32-bit representation of the field
 */
function getField($gameid) {
      $filename = CN_FILE_PATH."/".$gameid.".txt";
    $field = CN_FIELD_EMPTY; // 32 bit integer
    if (!file_exists($filename)) {
        if (!checkFolder()) {
            return CN_FIELD_ERR_CANNOT_CREATE; 
        }
        file_put_contents($filename, $field);
    }
    $field = file_get_contents($filename);
    return $field;
}

/**
 * Sets an index of the game to a value and returns the new state of filed.
 * If $gameid does not exist, returns CN_FIELD_ERR_NOT_FOUND
 * 
 * @param string $gameid ID of the game
 * @param integer $index index of the target value
 * @param boolean $value the new value at the target index (default = 1)
 * @return integer 32-bit representation of the field
 */
function setField($gameid, $index, $value=1) {
    // Sets $index field of game $gameid to $value (default = 1)
    // and returns the new state of the field.
    // If $gameid does not exist, returns 0x80000000
    $filename = CN_FILE_PATH."/".$gameid.".txt";
    if (!file_exists($filename)) {
        return CN_FIELD_ERR_NOT_FOUND;
    }
    $field = file_get_contents($filename);
    if ($value) {
        $field = setBit($field, $index);
    } else {
        $field = clearBit($field, $index);
    }
    file_put_contents($filename, $field);
    return $field;
}

?>