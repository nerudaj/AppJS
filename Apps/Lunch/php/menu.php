<?php
    include 'utility.php';
    include 'crow.php';
    include 'kos.php';
    include 'adam.php';
    include 'rubin.php';

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
            ],
			[
			    "name" => "Restaurace Rubín",
				"food" => getRubinLunch()
			]
        ];
        
        echo json_encode($result);
    }

    if (isset($_GET['direct'])) {
        $rests = [
            "crow" => getCrowLunch,
            "adam" => getAdamLunch,
            "kos"  => getKosLunch,
            "naber"=> getNaberLunch
        ];
        $key = $_GET['direct'];

        echo json_encode($rests[$key]());
    }
?>
