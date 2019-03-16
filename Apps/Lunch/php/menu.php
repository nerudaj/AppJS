<?php
    include 'utility.php';
    include 'crow.php';
    include 'kos.php';
    include 'adam.php';

    if (isset($_GET['mode']) && $_GET['mode'] == "read") {
        $result = [
            [
                "name" => "Crowbar Cafe",
                "food" => getCrowLunch()
            ],
            [
                "name" => "Hospůdka u Adama",
                "food" => getAdamLunch()
            ],
            [
                "name" => "U Dvou kosů",
                "food" => getKosLunch()
            ]
        ];
        
        echo json_encode($result);
    }
?>
