<?php
function getNaberLunch() {
    $URL = "http://nabersi.cz/";

    $file = getSourceOfUrl($URL);

    // Parse $file into $DOM structure
    $DOM = new DOMDocument;
    @$DOM->loadHTML($file);

    $tbodys = $DOM->getElementsByTagName('tbody');

    echo $tbodys[0]->textContent;
}
?>