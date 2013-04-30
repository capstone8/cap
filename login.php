<?php 
error_reporting(E_ALL);
ini_set('display_errors', '1');

include_once('dbconnect.php');



if (isset($_POST['login'])){
	$_SESSION['username'] = $_POST['username'];
	$user = mysqli_real_escape_string($link,$_POST['username']);
	$query = "SELECT Employee.userName, Auth.salt, Auth.authID FROM Auth,Employee WHERE Auth.authID = Employee.authid AND Employee.userName= '$user'";
	$result = mysqli_query($link,$query);
	$data = mysqli_fetch_assoc($result);
	if ($data){
		$pass = sha1($data['salt'].$_POST['password']);
		$query = "SELECT 1 FROM Auth WHERE authID={$data['authID']} AND password='$pass'";	
		mysqli_query($link,$query);
		if ($data)
			//exec("nodejs server.js &",$output);
			header('Location: http://'.$_SERVER["HTTP_HOST"].':8080/index.html');
		}
	else echo("<span style= color:red>User/Pass was wrong try again!</span>");	
		
}


?>

<!DOCTYPE html>

<html>

<head>
<title>Employee - Login</title>
<h3>Login</h3>
</hr>
</head>
<body>
<pre>
  		<form action="login.php" method="post">
           Username: <input type="text" name="username">
           Password: <input type="password" name="password">
           <input type="submit" name="login" value="Login">
        </form>
</pre>
</body>





</html>
