<?php
// TODO: require_once('fio.php');

function testGetParam($key) {
	if (!isset($_GET[$key])) {
		echo $key . " GET parameter is not set";
		exit 1;
	}
}

testGetParam('mode');
testGetParam('gameid');
$mode = $_GET['mode'];
$gameId = $_GET['gameid'];

if ($mode == 'get') {
	// TODO: use fio and save result into $field
	$field = 0;
	$fieldAsArray = convertNumberToArray($field);
	echo json_encode($fieldAsArray);
} elseif ($mode == 'set') {
	testGetParam('value');
	$value = $_GET['value'] > 0 ? 1 : 0;

	// TODO: use fio
	echo 0;
}
?>