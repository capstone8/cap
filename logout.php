<?php
	session_start();
	session_cache_limiter('private');
	
	session_unset();
	session_destroy();
	header('location:login.php');
?>