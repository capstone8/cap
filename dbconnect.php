<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
	session_start();
	session_cache_limiter('private');
	
	// Set up MySQL connection
	$host = "localhost";
	$username = "root";
	$password = "teamx!";
	$db_name = "capstone";
	
	
	 $link = mysqli_connect($host, $username, $password) or die("Could not connect ".mysql_error());

     mysqli_select_db($link, $db_name) or die("Could not connect: " . mysql_error()) ;
     
?>
