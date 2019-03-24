<?php
    include 'utility.php';
    include 'crow.php';
    include 'kos.php';
    include 'adam_grill.php';
    include 'rubin.php';
    include 'naber.php';

    if (isset($_GET['mode']) && $_GET['mode'] == "read") {
        $result = [
            [
                "name" => "Crowbar Cafe",
                "food" => getCrowLunch()
            ],
            [
                "name" => "Hospůdka u Adama",
                "food" => getAdamGrillLunch('adam.txt')
            ],
            [
                "name" => "Pizzeria na Place (Grill)",
                "food" => getAdamGrillLunch('grill.txt');
            ],
            [
                "name" => "U Dvou kosů",
                "food" => getKosLunch()
            ],
            [
                "name" => "Restaurace Rubín",
                "food" => getRubinLunch()
            ],
            [
                "name" => "Naber si",
                "food" => getNaberLunch()
            ]
        ];
        
        echo json_encode($result);
    }
?>
