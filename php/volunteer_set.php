<?php 
	
	// unsafe disable of CORS for local use ONLY
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT');
	header('Access-Control-Max-Age: 1000');
	
	header('content-type: application/json; charset=utf-8');
	
	require_once("db.php");
	require_once("func_ratings.php");
	
	// login credentials
	$prod = 1; // set product to HoodSearch (0=ServACE)
	$role = 2; // set role to Volunteer/Home Buyer
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
	
	if (isset($_GET['prod']))
		$prod = $_GET['prod'];
	else if (isset($_POST['prod']))
		$prod = $_POST['prod'];
	
	// volunteer profile
	$fname="";
	$lname="";
	$email="";
	if (isset($_GET['fname']))
		$fname = $_GET['fname'];
	else if (isset($_POST['fname']))
		$fname = $_POST['fname'];
	
	if (isset($_GET['lname']))
		$lname = $_GET['lname'];
	else if (isset($_POST['lname']))
		$lname = $_POST['lname'];
	
	if (isset($_GET['email']))
		$email = $_GET['email'];
	else if (isset($_POST['email']))
		$email = $_POST['email'];
	
	$desc = ""; // json return
	$error_code = 2; // default DB error code
	$err_sql = "";
	
	//echo("TEST{{{".$uname." ".$pwd." ".$fname." ".$lname." ".$email."}}}");
	if ((!empty($uname)) &&
		(!empty($pwd)) &&
		(!empty($fname)) &&
		(!empty($lname)) &&
		(!empty($email)))
	{		
		// do not allow duplicate usernames
		if (does_user_exist($uname) == 0) {
			
			// put info into database for login
			$sql = "insert into logins (username, userpwd, roleid, product) values ('$uname', '$pwd', '$role', '$prod')";
							
			$lres = mysqli_query($con, $sql);		
			if ($lres){
				// get id generated for new login
				$last_id = mysqli_insert_id($con);
				
				// put info into database for volunteer
				$sql = "insert into volunteers (firstname, lastname, email, loginid) 
				values ('$fname', '$lname', '$email', $last_id)";
				$res = mysqli_query($con, $sql);		
				if ($res){
					$error_code = 0; // success
				} else {
					$error_code = 2; // DB error
					$err_sql = mysqli_error($con) . "->volunteers";
				}
			} else {
				$error_code = 2; // DB error
				$err_sql = mysqli_error($con) . "->logins";
			}
		} else {
			$error_code = 3; // Duplicate login error
		}
	}
	else {
		$error_code = 1; // incomplete 
	}
	
	// set error code description
	if ($error_code == 0) {// success
		$desc = $desc . "Volunteer Registered successful.";
	}
	else if ($error_code == 1) {// incomplete
		$desc = $desc . "Form not filled out completely. Try again.";
	}	
	else if ($error_code == 2) {// DB error
		$desc = $desc . "Error inserting into DB. " . $err_sql;
	}	
	else if ($error_code == 3) {// duplicate error
		$desc = $desc . "Login already exists. Try again.";
	}	
	
	// set json	error code
	$info["code"] = $error_code;
	$info["desc"] = $desc;
	echo json_encode($info);
?>