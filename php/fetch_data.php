<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);

}

require "dbconnect.php";

$data = file_get_contents("php://input");
if (isset($data)) {
    $request = json_decode($data, true);
    $mode = $request['mode'];
}
if ($mode == "loginUser") {
	if (isset($data)) {
		$request = json_decode($data);
		$username = $request->username;
		$password = $request->password;
	}
	
	$username = stripslashes($username);
	$password = md5(stripslashes($password));
	
	$sql = "SELECT id FROM users WHERE username='$username' AND password='$password'";
	$res = $con->query($sql);
	
	$count = mysqli_num_rows($res);
	
	if ($count > 0) {
		$response = "Login successful";
	} else {
		$response = "Login unsuccessful";
	}
	
	echo json_encode($response);
} else if ($mode == "fetchUserDetails") {
	if (isset($data)) {
		$request = json_decode($data);
		$username = $request->username;
		$password = $request->password;
	}
	
	$username = stripslashes($username);
	$password = md5(stripslashes($password));
	
	$sql = "SELECT id, first_name, last_name, email, share_id FROM users WHERE username='$username' AND password='$password'";
	$result = mysqli_query($con, $sql);
	$response = array();

	while ($row = mysqli_fetch_array($result)) {
    	array_push($response, array("id" => $row[0],
    	    "first_name" => $row[1],
    	    "last_name" => $row[2],
    	    "email" => $row[3],
    	    "share_id" => $row[4]
    	    )
    	);
	}

	echo json_encode($response);
} else if ($mode == "fetchStoredRecords") {
	if (isset($data)) {
		$request = json_decode($data);
		$share_id = $request->share_id;
	}
	
	$share_id = stripslashes($share_id);
	
	$sql = "SELECT serial_number, department, reference_number, product_type, date_of_purchase, product_cost, code_format, id_of_scanner FROM scanned_codes WHERE share_id='$share_id'";
	$result = mysqli_query($con, $sql);
	$response = array();
	
	while ($row = mysqli_fetch_array($result)) {
		array_push($response, array(
				"serial_number" => $row[0],
				"department" => $row[1],
				"reference_number" => $row[2],
				"product_type" => $row[3],
				"date_of_purchase" => $row[4],
				"product_cost" => $row[5],
				"code_format" => $row[6],
				"id_of_scanner" => $row[7]
			)
		);
	}
	
	echo json_encode(array("server_response" => $response));
} else if ($mode == "fetchCodeDetails") {
	if (isset($data)) {
		$request = json_decode($data);
		$serial_number = $request->serial_number;
		$share_id = $request->share_id;
	}
	
	$serial_number = stripslashes($serial_number);
	$share_id = stripslashes($share_id);
	
	$sql = "SELECT serial_number, department, reference_number, product_type, date_of_purchase, product_cost, code_format, id_of_scanner FROM scanned_codes WHERE serial_number='$serial_number' AND share_id='$share_id'";
	$result = mysqli_query($con, $sql);
	$response = array();
	
	while ($row = mysqli_fetch_array($result)) {
		array_push($response, array(
				"serial_number" => $row[0],
				"department" => $row[1],
				"reference_number" => $row[2],
				"product_type" => $row[3],
				"date_of_purchase" => $row[4],
				"product_cost" => $row[5],
				"code_format" => $row[6],
				"id_of_scanner" => $row[7]
			)
		);
	}
	
	echo json_encode(array("server_response" => $response));
}
mysqli_close($con);

?>
