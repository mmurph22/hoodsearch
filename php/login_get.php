<?php 
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET');
	header('Access-Control-Max-Age: 1000');

	header('content-type: application/json; charset=utf-8');
	
	require_once("db.php");
	require_once("func_ratings.php");
	
	// login credentials
	$role = 0; // Determine the role from login
	$state = -1; // logout=0; login=1; error=-1
	$uname="";
	$pwd="";
	if (isset($_GET['uname']))
		$uname = $_GET['uname'];
	else if (isset($_POST['uname']))
		$uname = $_POST['uname'];
	
	if (isset($_GET['pwd']))
		$pwd = $_GET['pwd'];
	else if (isset($_POST['pwd']))
		$pwd = $_POST['pwd'];
	
	if (isset($_GET['state']))
		$state = intval($_GET['state']);
	else if (isset($_POST['state']))
		$state = intval($_POST['state']);
	
	// error check inputs
	$error_code = 1; // invalid login default
	$desc = "Credentials not validated.";
	if ((empty($uname)) || ($state < 0)) {
		$error_code = 2;
		$desc = "Missing inputs. Username or State.";
	} else {
		if (($state > 0) && (empty($pwd))) {
			$error_code = 2;
			$desc = "Missing inputs. password.";
		}
	}
	// code = 1
	if ($error_code < 2) {
		// by lookup
		$sql = "select * from logins where username = '".$uname."'";
		if ($state > 0)
			$sql = $sql . " and userpwd = '".$pwd."'";
		
		$res = mysqli_query($con, $sql);
		if (!$res)
			die("Query Invalid" . mysqli_error($con));
		
		// valid return on query
		// if not entering this loop, then credentials invalid (error_code = 1)
		//$info = array();				
		if($row = mysqli_fetch_assoc($res)) {
			// set logged in/out bit
			//$row["state"] = $state;
			
			$s_sql = "update logins set state='".$state."' where username = '".$uname."'";
			$s_res = mysqli_query($con, $s_sql);
			if (!$s_res)
				die("Query Invalid" . mysqli_error($con));
			
			// add enhanced data
			$error_code = 0; // success
			if ($state == 0)
				$desc = "Logout Successful.";
			else
				$desc = "Login Successful.";
		
			//array_push($info, $row);
		}
	}
	
	$info["code"] = $error_code;
	$info["desc"] = $desc;
	echo json_encode($info);
?>