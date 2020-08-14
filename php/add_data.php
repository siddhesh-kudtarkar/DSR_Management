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

if ($mode == "addUser") {
	if (isset($data)) {
		$request = json_decode($data);
		$first_name = $request->first_name;
		$last_name = $request->last_name;
		$username = $request->username;
		$email = $request->email;
		$password = $request->password;
		$share_id = $request->share_id;
	}

	$first_name = stripslashes($first_name);
	$last_name = stripslashes($last_name);
	$username = stripslashes($username);
	$email = stripslashes($email);
	$password = md5(stripslashes($password));
	$share_id = stripslashes($share_id);

	$sql = "INSERT INTO users(first_name, last_name, username, email, password, share_id) VALUES('$first_name', '$last_name', '$username', '$email', '$password', '$share_id')";
	$res = mysqli_query($con, $sql);

	if ($res == TRUE) {
		$response = "Registration successful";
	} 
	else {
		$response = "Error: " . $sql . "<br>" . $db->error;
	}
	echo json_encode($response);
} else if ($mode == "addBarcodeAndQrCode") {
	if (isset($data)) {
		$request = json_decode($data);
		$serial_number = $request->serial_number;
		$department = $request->department;
		$reference_number = $request->reference_number;
		$product_type = $request->product_type;
		$date_of_purchase = $request->date_of_purchase;
		$product_cost = $request->product_cost;
		$code_format = $request->code_format;
		$id_of_scanner = $request->id_of_scanner;
		$share_id = $request->share_id;
	}

	$serial_number = stripslashes($serial_number);
	$department = stripslashes($department);
	$reference_number = stripslashes($reference_number);
	$product_type = stripslashes($product_type);
	$date_of_purchase = stripslashes($date_of_purchase);
	$product_cost = stripslashes($product_cost);
	$code_type = stripslashes($code_type);
	$code_format = stripslashes($code_format);
	$id_of_scanner = stripslashes($id_of_scanner);
	$share_id = stripslashes($share_id);

	$sql = "INSERT INTO scanned_codes(serial_number, department, reference_number, product_type, date_of_purchase, product_cost, code_format, id_of_scanner, share_id) VALUES('$serial_number', '$department', '$reference_number', '$product_type', '$date_of_purchase', '$product_cost', '$code_format', $id_of_scanner, '$share_id')";

	if ($con->query($sql) == TRUE) {
		$response= "Added successfully";
	} 
	else {
		$response= "Error: " . $sql . "<br>" . $db->error;
	}
	echo json_encode($response);
}
mysqli_close($con);
?>
