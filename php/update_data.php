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
if ($mode == "updateUserDetails") {
	if (isset($data)) {
		$request = json_decode($data);
		$username = $request->username;
		$first_name = $request->first_name;
		$last_name = $request->last_name;
		$email = $request->email;
		$share_id = $request->share_id;
	}

	$username = stripslashes($username);
	$first_name = stripslashes($first_name);
	$last_name = stripslashes($last_name);
	$email = stripslashes($email);
	$share_id = stripslashes($share_id);

	$sql = "UPDATE users SET first_name='$first_name', last_name='$last_name', email='$email', share_id='$share_id' WHERE username='$username'";

	if ($con->query($sql) == TRUE) {
		$response= "Account Details updated successfully";
	} 
	else {
		$response= "Error: " . $sql . "<br>" . $db->error;
	}
	echo json_encode($response);
}
?>
