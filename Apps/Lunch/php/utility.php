<?php
function getSourceOfUrl($url) {
    return file_get_contents($url);
}

function getSourceOfUrlSanitized($url) {
    $file = getSourceOfUrl($url);
    return mb_convert_encoding($file, 'HTML-ENTITIES', "UTF-8");
}

function getSourceOfFile($path) {
    $handle = @fopen($path, "r");
    if (!$handle) return null;

    $data = fread($handle, filesize($path));
    fclose($handle);

    return $data;
}

function getTodayNum() {
    return date('N') - 1;
}

function getTodayName() {
    $days = [
        "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"
    ];
    return $days[getTodayNum()];
}

function startsWith($str, $prefix) {
    return substr($str, 0, strlen($prefix)) == $prefix;
}
?>