<?php
function getKosLunch() {
    $URL = "https://udvoukosu.webs.com/j-deln-l-stek";

    $file = getSourceOfUrlSanitized($URL);

    // Parse $file into $DOM structure
    $DOM = new DOMDocument;
    @$DOM->loadHTML($file);
    
    // Relevant elements for lunch parsing 
    $divs = $DOM->getElementsByTagName('div');
    
    
    // Get day of week
    $todayNum = getTodayNum();
    if ($todayNum >= 5) return ['Zavřeno'];
    $today = getTodayName();
    
    // Loop over relevant divs
    $lines = null;
    $soup = null;
    for ($i = 0; $i < $divs->length; $i++) {
        $div = $divs[$i];
        
        // Relevant div has attributes and childNodes
        if (!$div->hasAttributes()) continue;
        
        // Is of class text-content
        /*if ($div->getAttribute("style") == "text-align: center; color: rgb(255, 149, 0);") {
            $text = $div->textContent;
			echo $text."<br>";
           // echo $text;
            if (startsWith(trim($text), "1.") || startsWith(trim($text), "2.")) {
                $texts[] = $text;
            }
            else if (startsWith($text, $today)) {
                $soup = $text;
            }
        }*/
		if (startsWith(trim($div->getAttribute("class")), "webs-container webs-module-text")) {
			$text = $div->textContent;
			$lines = explode(')', $text);
		}
    }
    
	$offsets = [-1, -1, -1, -1, -1, (sizeof($lines) - 1)];
	
	for ($i = 0; $i < sizeof($lines); $i++) {
		if (strpos($lines[$i], "Pondělí") !== false) {
			//echo "PO";
			$offsets[0] = $i;
		}
		else if (strpos($lines[$i], "Úterý") !== false) {
			//echo "UT";
			$offsets[1] = $i;
		}
		else if (strpos($lines[$i], "Středa") !== false) {
			//echo "ST";
			$offsets[2] = $i;
		}
		else if (strpos($lines[$i], "Čtvrtek") !== false) {
			//echo "ČT";
			$offsets[3] = $i;
		}
		else if (strpos($lines[$i], "Pátek") !== false) {
			//echo "PÁ";
			$offsets[4] = $i;
		}
	}
	
    // If soup not found, use backup algorithm
    /*if ($soup == null) {
        $ps = $DOM->getElementsByTagName('p');
        for ($i = 0; $i < $ps->length; $i++) {
            $text = $ps[$i]->textContent;
            
            if (startsWith($text, $today)) {
                $soup = $text;
            }
        }
    }*/
    
    return array_slice($lines, $offsets[$todayNum], $offsets[$todayNum + 1] - $offsets[$todayNum]);
}
?>