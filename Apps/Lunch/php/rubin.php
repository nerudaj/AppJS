<?php
function getRubinLunch() {
	$URL = "http://restauracerubin.cz/";
	
	$file = getSourceOfUrl($URL);

    // Parse $file into $DOM structure
    $DOM = new DOMDocument;
    @$DOM->loadHTML($file);
	
	$tables = $DOM->getElementsByTagName('table');
	$food_tables = [];
	for ($i = 0; $i < $tables->length; $i++) {
		if ($tables[$i]->hasAttributes() && $tables[$i]->getAttribute("class") == "menu_table") {
			$food_tables[] = $tables[$i];
		}
	}
	
	// Get day of week
	$todayNum = getTodayNum();
	if ($todayNum >= 5) return ['Zavřeno'];
	$today = getTodayName();
	
	// Loop over relevant elements <table><tbody><tr>...
	$result = [];
	for ($t = 0; $t < sizeof($food_tables); $t++) {
		$trs = $food_tables[$t]->childNodes;
		for ($i = 0; $i < $trs->length; $i++) {
			$result[] = $trs[$i]->textContent;
		}
	}
	
	return $result;
}
?>