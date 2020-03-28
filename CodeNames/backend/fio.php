<?php
define("CN_MAX_FILES",  20); //max files in directory (not used yet)
define("CN_MAX_ACTIVE_GAMES", 10); //max concurrent games
define("CN_MIN_TIME_TO_DELETE", 60*45);  //time after which an active game can be deleted
    // Active game is a game that has the field state != 0x00000000
    // (i.e. an empty board, but you can set some unused bit (except MSB) to indicate an active game)
define("CN_MAX_TIME_TO_DELETE", 60*60*24); //time after a file will be deleted
define("CN_FILE_PATH", "games");

/**
 * Return true if new game field can be created else return false
 * 
 * @return boolean true if new game can be created, else false
 */
function checkFolder(){
    $files = scandir(CN_FILE_PATH);
    $count_files = count($files) - 2;
    $now = time();
    $old_games = array();
    $inactive_games = array(); //FIXME: redundant
    $inactive_times = array();
    $active_games = array();
    for ($i = 2; $i<$count_files + 2; $i++){
        $filename = CN_FILE_PATH."/".$files[$i];
        $filetime = filemtime($filename);
        $age = $now - $filetime;
        if ($age > CN_MAX_TIME_TO_DELETE){
            // older than 24 hours
            $old_games[] = $filename;
        }elseif($age > CN_MIN_TIME_TO_DELETE or !file_get_contents($filename)){
            // older than 45 mins or not a single card flipped
            $inactive_games[] = $filename;
            $inactive_times[] = $filetime;
        }else{
            // younger than 45 min with some card flipped
            $active_games[] = $filename;
        }
    }

    // delete all old files
    foreach($old_games as $file){
        unlink($file);
    }


    $count_active = count($active_games);
    if ($count_active >= CN_MAX_ACTIVE_GAMES){
        return False;
    }

    // delete all inactive games until there is less than max games
    while ($count_active + count($inactive_times) >= CN_MAX_ACTIVE_GAMES){
        //delete oldest inactive game
        $oldest_inactive_index = array_search(min($inactive_times), $inactive_times);
        unlink($inactive_games[$oldest_inactive_index]); // delete from disk
        unset($inactive_times[$oldest_inactive_index]); // remove date from array
    }

    return True;

}


/**
 * Returns the current state of the field or creates new one
 * if it does not exist and returns that. Returns an error code otherwise.
 * If the field cannot be created, returns an errror code 0x8000000 (see checkFolder()).
 * 
 * @param string $gameid ID of the game
 * @return integer 32-bit representation of the field
 */
function getField($gameid) {
      $filename = CN_FILE_PATH."/".$gameid.".txt";
    $field = 0x00000000; // 32 bit integer
    if(!file_exists($filename)){
        if(!checkFolder()){
            return 0x80000000; 
        }
        file_put_contents($filename, $field);
    }
    $field |= file_get_contents($filename);
    //fclose($file);
    return $field;
}

/**
 * Sets an index of the game to a value and returns the new state of filed.
 * If $gameid does not exist, returns 0x80000000
 * 
 * @param string $gameid ID of the game
 * @param integer $index index of the target value
 * @param boolean $value the new value at the target index (default = 1)
 * @return integer 32-bit representation of the field
 */
function setField($gameid, $index, $value=1){
    // Sets $index field of game $gameid to $value (default = 1)
    // and returns the new state of the field.
    // If $gameid does not exist, returns 0x80000000
    $filename = CN_FILE_PATH."/".$gameid.".txt";
    if(!file_exists($filename)){
        return 0x80000000; // file does not exist
    }
    $field = file_get_contents($filename);
    if($value){
        $field |= 1 << $index; // set bit
    }else{
        $field &= ~(1 << $index); // clear bit
    }
    file_put_contents($filename, $field);
    return $field;
}

?>