<?php 
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET');
	header('Access-Control-Max-Age: 1000');

	header('content-type: application/json; charset=utf-8');
	
	require_once("db.php");
	require_once("func_ratings.php");
	
	// get the login selected
	$loginid=0;
	if (isset($_GET['loginid']))
		$loginid = intval($_GET['loginid']);
	else if (isset($_POST['loginid']))
		$loginid = intval($_POST['loginid']);
	else
	{
		// we can also use an input login name to retrieve login is
		$uname=0;
		if (isset($_GET['uname']))
			$uname = $_GET['uname'];
		else if (isset($_POST['uname']))
			$uname = $_POST['uname'];
		
		$nsql = "Select userid from logins where username = '".$uname."'";
		$nres = mysqli_query($con, $nsql);
		if (!$nres)
			die("Query Invalid" . mysqli_error($con));
		else {
			$irow = mysqli_fetch_array($nres);
			$loginid = $irow['userid'];	// got the id!
		}
	}
		
	$lsql = "Select * from logins where userid = '".$loginid."'";
	$lres = mysqli_query($con, $lsql);
	if (!$lres)
		die("Query Invalid" . mysqli_error($con));
	
	$lrow = mysqli_fetch_array($lres); 
	$roleid = $lrow['roleid'];
	
	// profile sql: volunteer or coordinator
	if ($roleid == '2'){ // volunteer
		$psql = "select *, SPACE(1) as 'roleid' from volunteers where loginid = '".$loginid."'";
	}
	else if ($roleid == '3') { // coordinator
		$psql = "select *, SPACE(1) as 'roleid' from venues where loginid = '".$loginid."'";
	}

	$info = array();
	if (isset($psql)) {
		$pres = mysqli_query($con, $psql);
		if (!$pres)
			die("Query Invalid" . mysqli_error($con));
				
		while($prow = mysqli_fetch_assoc($pres)) {
			// add enhanced data
			$prow['roleid'] = $roleid;
			array_push($info, $prow);
		}
	}
	echo json_encode($info);	
?>