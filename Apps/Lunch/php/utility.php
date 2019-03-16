<?php
function getSourceOfUrl($url) {
    return file_get_contents($url);
}

function getSourceOfUrlSanitized($url) {
    $file = getSourceOfUrl($url);
    return mb_convert_encoding($file, 'HTML-ENTITIES', "UTF-8");
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