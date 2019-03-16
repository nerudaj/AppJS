<?php
function getCrowLunch() {
    $URL = "http://www.cafecrowbar.cz/poledni-menu.php";

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
    $match = null;
    for ($i = 0; $i < $divs->length; $i++) {
        $div = $divs[$i];
        
        // Relevant div has attributes and childNodes
        if (!$div->hasAttributes() || !$div->hasChildNodes()) continue;
        
        // Is of class text-content
        if ($div->getAttribute("class") == "text-content") {
            $children = $div->childNodes;
            
            // One of his children has text containing $today
            for ($p = 0; $p < $children->length; $p++) {
                $text = $children[$p]->textContent;
                if (startsWith($text, $today)) {
                    $match = $div;
                    $p = $children->length;
                    $i = $divs->length;
                }
            }
        }
    }
    
    // Get only <p> textContent from $match (-> soup and main course)
    $children = $match->childNodes;
    
    $result = [];
    for ($i = 0; $i < $children->length; $i++) {
        $child = $children[$i];
        if ($child->nodeName == "p") {
            $result[] = $child->textContent;
        }
    }
    
    $result[0] = "Polévka - " . $result[0];

    return $result;
}
?>