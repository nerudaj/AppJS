<?php
function getAdamGrillLunch($filename) {
    $URL = $filename;

    $file = getSourceOfFile($URL);
    if ($file == null) return [ "Nepodařilo se získat data" ];

    $todayNum = getTodayNum();
    if ($todayNum >= 5) return [ "Zavřeno" ];
    $today = getTodayName();

    $sections = explode("\n\n", $file);
    $lines = explode("\n", $sections[$todayNum]);
    array_shift($lines);

    return $lines;
}
?>