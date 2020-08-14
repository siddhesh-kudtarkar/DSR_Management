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
if ($mode == "checkBarcodeAndQrCodeSerial") {
	if (isset($data)) {
		$request = json_decode($data);
		$serial_number = $request->serial_number;
		$share_id = $request->share_id;
	}

	$serial_number = stripslashes($serial_number);
	$share_id = stripslashes($share_id);

	$sql = "SELECT id, serial_number FROM scanned_codes WHERE serial_number='$serial_number' AND share_id='$share_id'";
	$res = $con->query($sql);

	if ($res->num_rows == 0) {
		$response = "Not present";
	} 
	else {
		$response = "Present";
	}
	echo json_encode($response);
} else if ($mode == "checkUsername") {
	if (isset($data)) {
		$request = json_decode($data);
		$username = $request->username;
	}

	$username = stripslashes($username);

	$sql = "SELECT id FROM users WHERE username='$username'";
	$res = $con->query($sql);
	$count = mysqli_num_rows($res);

	if ($count > 0) {
		$response = "Present";
	} 
	else {
		$response = "Not present";
	}
	echo json_encode($response);
}
?>
