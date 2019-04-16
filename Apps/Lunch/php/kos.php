<?php
function getKosLunch() {
    $URL = "https://udvoukosu.webs.com/j-deln-l-stek";

    $file = getSourceOfUrlSanitized($URL);

    // Parse $file into $DOM structure
    $DOM = new DOMDocument;
    @$DOM->loadHTML($file);
    
    // Relevant elements for lunch parsing 
    $divs = $DOM->getElementsByTagName('p');
    
    
    // Get day of week
    $todayNum = getTodayNum();
    if ($todayNum >= 5) return ['Zavřeno'];
    $today = getTodayName();
    
    // Loop over relevant divs
    $texts = [];
    $soup = null;
    for ($i = 0; $i < $divs->length; $i++) {
        $div = $divs[$i];
        
        // Relevant div has attributes and childNodes
        if (!$div->hasAttributes()) continue;
        
        // Is of class text-content
        if ($div->getAttribute("style") == "color: rgb(255, 149, 0);") {
            $text = $div->textContent;
           // echo $text;
            if (startsWith($text, "1.") || startsWith($text, "2.")) {
                $texts[] = $text;
            }
            else if (startsWith($text, $today)) {
                $soup = $text;
            }
        }
    }
    
    // If soup not found, use backup algorithm
    if ($soup == null) {
        $ps = $DOM->getElementsByTagName('p');
        for ($i = 0; $i < $ps->length; $i++) {
            $text = $ps[$i]->textContent;
            
            if (startsWith($text, $today)) {
                $soup = $text;
            }
        }
    }

    $soup = substr($soup, strlen($today) + 3);
    $dishes = explode(') ', $texts[$todayNum]);
    
    return [ $soup, $dishes[0].')', $dishes[1].')' ];
}
?>