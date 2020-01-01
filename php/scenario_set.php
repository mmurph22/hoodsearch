<?php 
	
	// unsafe disable of CORS for local use ONLY
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT');
	header('Access-Control-Max-Age: 1000');
	
	header('content-type: application/json; charset=utf-8');
	
	require_once("db.php");
	require_once("func_ratings.php");

	$userid=-1;
	if (isset($_GET['userid']))
		$userid = intval($_GET['userid']);
	else if (isset($_POST['userid']))
		$userid = intval($_POST['userid']);
	
	// survey profile
	$name="";
	if (isset($_GET['name']))
		$name = $_GET['name'];
	else if (isset($_POST['name']))
		$name = $_POST['name'];
	
	$surveyid="";
	if (isset($_GET['surveyid']))
		$surveyid = $_GET['surveyid'];
	else if (isset($_POST['surveyid']))
		$surveyid = $_POST['surveyid'];

	$s123id="";
	if (isset($_GET['s123id']))
		$s123id = $_GET['s123id'];
	else if (isset($_POST['s123id']))
		$s123id = $_POST['s123id'];	

	//dates
	$create_date;
	if (isset($_GET['create_date']))
		$create_date = $_GET['create_date'];
	else if (isset($_POST['create_date']))
		$create_date = $_POST['create_date'];
	
	$update_date;
	if (isset($_GET['update_date']))
		$update_date = $_GET['update_date'];
	else if (isset($_POST['update_date']))
		$update_date = $_POST['update_date'];	
	
	$rating=-1;
	if (isset($_GET['rating']))
		$rating = intval($_GET['rating']);
	else if (isset($_POST['rating']))
		$rating = intval($_POST['rating']);
	
	$desc = ""; // json return
	$error_code = 2; // default DB error code
	$err_sql = "";
	
	//echo("TEST{{{".$userid." ".$name." ".$surveyid." ".$rating."}}}");
	if ((!empty($userid)) &&
		(!empty($name)) &&
		(!empty($surveyid)) &&
		(!empty($s123id)))
	{
		//(!empty($create_date)) &&
		//(!empty($update_date)) &&
		//(!empty($rating))	
		// do not allow duplicate surveyids
		if (does_scenario_exist($surveyid) == 0) {
			
			// put info into database for scenario
			$sql = "insert into scenarios (userid, name, surveyid, s123id) 
			values ('$userid', '$name', '$surveyid', '$s123id')";
							
			$lres = mysqli_query($con, $sql);		
			if ($lres){
				// get id generated for new scenario
				$last_id = mysqli_insert_id($con);
				$error_code = 0; // success
			} else {
				$error_code = 2; // DB error
				$err_sql = mysqli_error($con) . "->scenarios";
			}
		} else {
			// update info into database for scenario TBD
			$error_code = 3; // not supporting duplicate updates
		}
	}
	else {
		$error_code = 1; // incomplete 
	}
	
	// set error code description
	if ($error_code == 0) {// success
		$desc = $desc . "Scenario created successful.";
	}
	else if ($error_code == 1) {// incomplete
		$desc = $desc . "Form not filled out completely. Try again.";
	}	
	else if ($error_code == 2) {// DB error
		$desc = $desc . "Error inserting into DB. " . $err_sql;
	}	
	else if ($error_code == 3) {// duplicate error
		$desc = $desc . "Scenario already exists. Try again.";
	}	
	
	// set json	error code
	$info["code"] = $error_code;
	$info["desc"] = $desc;
	echo json_encode($info);
?>