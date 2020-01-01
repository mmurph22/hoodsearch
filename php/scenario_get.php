<?php 
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET');
	header('Access-Control-Max-Age: 1000');

	header('content-type: application/json; charset=utf-8');
	
	require_once("db.php");
	require_once("func_ratings.php");
	
	// get the role selected
	$scnid = 0;
	if (isset($_GET['scnid']))
		$scnid = intval($_GET['scnid']);
	else if (isset($_POST['scnid']))
		$scnid = intval($_POST['scnid']);
	else
	{
		// we can also use the survey id
		$surveyid="";
		if (isset($_GET['surveyid']))
			$surveyid = $_GET['surveyid'];
		else if (isset($_POST['surveyid']))
			$surveyid = $_POST['surveyid'];
		
		$nsql = "Select scnid from scenarios where surveyid = '".$surveyid."'";
		$nres = mysqli_query($con, $nsql);
		if (!$nres)
			die("Query Invalid" . mysqli_error($con));
		else {
			$irow = mysqli_fetch_array($nres);
			$scnid = intval($irow['scnid']);	// got the id!
		}
	}
	
	$sql = "Select * from scenarios where scnid = '".$scnid."'";
	$res = mysqli_query($con, $sql);
	if (!$res)
		die("Query Invalid" . mysqli_error($con));
	// valid return on query
	//$row = mysqli_fetch_array($res);
	$info = array();				
	while($row = mysqli_fetch_assoc($res)) {
		// add enhanced data
		array_push($info, $row);
	}
	echo json_encode($info);
?>