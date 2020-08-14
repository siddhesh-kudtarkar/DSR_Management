<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	exit(0);
}

require "dbconnect.php";

$data = file_get_contents("php://input");
if (isset($data)) {
	$request = json_decode($data);
	$mode = $request->mode;
}
if ($mode == "deleteCodeRecord") {
	if (isset($data)) {
		$request = json_decode($data);
		$serial_number = $request->serial_number;
		$share_id = $request->share_id;
		$id_of_scanner = $request->id_of_scanner;
	}

	$serial_number = stripslashes($serial_number);
	$share_id = stripslashes($share_id);
	$id_of_scanner = stripslashes($id_of_scanner);

	$sql = "DELETE FROM scanned_codes WHERE serial_number='$serial_number' AND share_id='$share_id' AND id_of_scanner=$id_of_scanner";
	$res = $con->query($sql);

	if ($res === TRUE) {
		$response = "Deleted successfully";
	} 
	else {
		$response = "Error: " . $sql . "<br>" . $db->error;
	}
	echo json_encode($response);
} else if ($mode == "deleteUserAccount") {
	if (isset($data)) {
		$request = json_decode($data);
		$id = $request->id;
	}

	$id = stripslashes($id);

	$sql1 = "DELETE FROM scanned_codes WHERE id_of_scanner=$id";
	$res1 = $con->query($sql1);

	$sql2 = "DELETE FROM users WHERE id=$id";
	$res2 = $con->query($sql2);

	if ($res1 == TRUE && $res2 == TRUE) {
		$response = "Deleted successfully";
	} 
	else {
		$response = "Error: " . $sql . "<br>" . $db->error;
	}
	echo json_encode($response);
}
?>
