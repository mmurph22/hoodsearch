<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET');
	header('Access-Control-Max-Age: 1000');
	
	header('content-type: application/json; charset=utf-8');
	
	//session_start(); 
	require_once("db.php");
	require_once("func_ratings.php");
	
	if (isset($_GET['userid']))
		$userid = $_GET['userid'];
	else if (isset($_POST['userid']))
		$userid = $_POST['userid'];
	
	// get list of scenarios
	$sql = "Select b.scnid, b.userid, b.name, b.s123id, b.surveyid, b.create_date, b.update_date, b.rating
		from logins a
		inner join scenarios b on
		b.userid = a.userid
		where b.userid = '" . $userid . "' 
		order by a.username, b.create_date";
	 
	$res = mysqli_query($con, $sql);
	if (!$res)
		die("Query Invalid" . mysqli_error($con));
	// valid return on query
	$info = array();				
	while($row = mysqli_fetch_assoc($res)) {
		// add enhanced data
		// $row["vols_required"]= get_actual_volunteers_required($row["eventid"]);
		
		array_push($info, $row);
	}
	echo json_encode($info);
	
?>
