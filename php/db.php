<?php
	/*
	// remote collisions
	$hostname = "geogthemis001.umd.edu"; //localhost
	$username = "mmurph22";
	$passwd = "bestgis@umd";
	$passwd = "u25@mpsgis";
	$dbname = "collisions_db";
	*/
	
	// remote live
	$hostname = "129.2.24.226";
	$username = "mmurph22";
	$passwd = "user@db#6";
	$dbname = "mmurph22";
	
	
	// local collisions
	/*	
	$hostname = "localhost";
	$username = "root";
	$passwd = "1qazXSW@";
	$dbname = "collisions_db";
	*/
	
	// local sandbox
	/*
	$hostname = "localhost";
	$username = "root";
	$passwd = "1qazXSW@";
	$dbname = "sandbox";
	*/
	
	// connect
	$con = mysqli_connect($hostname, $username, $passwd, $dbname);
	if(!$con)
		die("Database connection error " . mysqli_connect_error());

?>
