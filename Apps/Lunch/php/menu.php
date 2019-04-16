<?php
    include 'utility.php';
    include 'crow_v2.php';
    include 'kos.php';
    include 'file.php';
    include 'rubin.php';
    include 'naber.php';

    function getAdamLunch() {
        return getLunchFromFile("adam.txt");
    }

    function getGrillLunch() {
        return getLunchFromFile("grill.txt");
    }

    if (isset($_GET['where'])) {
        $where = $_GET['where'];

        $lunches = [ // Each name maps to name of restaurant and name of callback
            "adam" => [
                "Hospůdka u Adama", "getAdamLunch", "apple-alt"
            ],
            "crow" => [
                "Crowbar Cafe", "getCrowLunch", "coffee"
            ],
            "grill" => [
                "Pizzeria na Place (Grill)", "getGrillLunch", "pizza-slice"
            ],
            "kos" => [
                "U Dvou kosů", "getKosLunch", "crow"
            ],
            "naber" => [
                "Naber si", "getNaberLunch", "utensil-spoon"
            ],
            "rubin" => [
                "Restaurace Rubín", "getRubinLunch", "gem"
            ]
        ];

        
        $lunch = $lunches[$where];
        $result = [
            "name" => $lunch[0],
            "food" => $lunch[1](),
            "icon" => $lunch[2]
        ];

        echo json_encode($result);
    }
?>
