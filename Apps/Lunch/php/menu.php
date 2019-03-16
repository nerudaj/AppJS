<?php
    include 'utility.php';
    include 'crow.php';
    include 'kos.php';

    if (isset($_GET['mode']) && $_GET['mode'] == "read") {
        $result = [
            [
                "name" => "Crowbar Cafe",
                "food" => getCrowLunch()
            ],
            [
                "name" => "U Dvou kosů",
                "food" => getKosLunch()
            ]
        ];
        
        echo json_encode($result);
    }
?>
