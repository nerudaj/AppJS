<?php
function getNaberLunch() {
    $URL = "http://nabersi.cz/";

    $file = getSourceOfUrl($URL);

    // Parse $file into $DOM structure
    $DOM = new DOMDocument;
    @$DOM->loadHTML($file);

    // Get day of week
    $todayNum = getTodayNum();
    if ($todayNum >= 5) return ['Zavřeno'];
    
    $tbodys = $DOM->getElementsByTagName('tbody');

    $food = trim($tbodys[0]->textContent);
    $food = str_replace("\n", "<br>", $food);
    return [ $food ];
}
?>