<?php 
error_reporting(E_ALL);
ini_set('display_errors', '1');
if (isset($_POST['reg']))
{
include_once('dbconnect.php');
	//$user= "";
	//$pass = "";
   if (isset($_POST['username']) && isset($_POST['password'])){
   		$user = $_POST['username'];
   		$first = $_POST['firstName'];
   		$last = $_POST['lastName'];
   		$pass =$_POST['password'];
   		$salt = sha1($_POST['password'].$user);
   		$pass = sha1($salt.$pass);
   		$sql = "INSERT INTO Auth (password, salt) VALUES ('$pass','$salt')";
   		$insert = mysqli_query($link,$sql);
   		$lastAuthID = mysqli_insert_id($link);
   		//$sql = "INSERT INTO Personal_Information (firstName,lastName,middleName,address,phoneNumber,birthDate,picPath) VALUES ('$first','$last','$middle','$address','$phone','$birth','$pic')";
   		$insert = mysqli_query($link,$sql);
   		$lastPersonalID = mysqli_insert_id($link);
   	    $sql = "INSERT INTO Employee (empID,userName,firstName,lastName,authid) VALUES ('$lastPersonalID','$user','$first','$last',$lastAuthID)";
	    $insert = mysqli_query($link,$sql);
		header('location:login.php');	
 	}


   // Close DB connection
	mysqli_close($link);
}

?>
<!DOCTYPE html>

<html>

<head>
<title>Employee - Registration</title>
<h3>Register</h3>
</hr>
</head>
<body>
<pre>
  		<form action="emp_register.php" method="post">
           Username: <input type="text" name="username">
           Password: <input type="password" name="password">
           First Name:<input type="text" name="firstName">
           Last Name:<input type="text" name="lastName">
           <input type="submit" name="reg" value="Register">
        </form>
</pre>
</body>





</html>
