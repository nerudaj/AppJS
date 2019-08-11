<?php
function getCrowLunch() {
    $URL = "https://www.menicka.cz/4865-cafe-crowbar.html";

    $file = getSourceOfUrl($URL);

    // Parse $file into $DOM structure
    $DOM = new DOMDocument;
    @$DOM->loadHTML($file);
    
    $divs = $DOM->getElementsByTagName('div');
    
    // Get day of week
    $todayNum = getTodayNum();
    if ($todayNum >= 5) return ['Zavřeno'];
    $today = getTodayName();
    
    // Loop over relevant divs
    $soups = [];
    $dishes = [];
    for ($i = 0; $i < $divs->length; $i++) {
        $div = $divs[$i];

        if (!$div->hasAttributes()) continue;
        if ($div->getAttribute("class") == "nabidka_1 capitalize") {
            $soups[] = $div->textContent;
        }
        else if ($div->getAttribute("class") == "nabidka_1") {
            $dishes[] = $div->textContent;
        }
    }
    
    $result = [];
    $result[0] = "Polévka - " . $soups[0];
    $result[1] = $dishes[0];

    return $result;
}
?>