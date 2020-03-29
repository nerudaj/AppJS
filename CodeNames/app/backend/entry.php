<?php
require_once('fio.php');

$response = [
	"status" => "ok",
	"payload" => []
];

function testAndGetParam($key) {
	if (!isset($_GET[$key])) {
		$response["status"] = "error";
		$response["payload"] =  $key . " GET parameter is not set";
		echo json_encode($response);
		exit(0);
	}

	return $_GET[$key];
}

function convertNumberToArray($num) {
	$index = 1;
	$result = [];

	for ($i = 0; $i < 25; $i++) {
		$result[] = (($num & $index) > 0) ? 1 : 0;
		$index *= 2;
	}

	return $result;
}

$mode = testAndGetParam('mode');
$gameId = testAndGetParam('gameid');

if ($mode == 'get') {
	$field = getField($gameId);
	$response["payload"] = convertNumberToArray($field);
} elseif ($mode == 'set') {
	$index = testAndGetParam('index');
	$field = setField($gameId, $index);
	$response["payload"] = convertNumberToArray($field);
}

echo json_encode($response);
?>