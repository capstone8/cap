<?php 
error_reporting(E_ALL);
ini_set('display_errors', '1');
if (isset($_POST['reg']))
{
include_once('dbconnect.php');
	//$user= "";
	//$pass = "";
   if (isset($_POST['firstName']) && isset($_POST['lastName'])){
   		
   		//personal_information
   		$first = $_POST['firstName'];
   		$last = $_POST['lastName'];
   
   		$street = $_POST['street'];
		$city = $_POST['city'];
		$state = $_POST['state'];
		$zip = $_POST['zip'];
   		$phone =$_POST['phone'];
   		$birth = $_POST['birthdate'];
   		$pic = $_POST['pic'];
   		//cust info
   		$shirt = $_POST['shirt'];
   		$pant = $_POST['pant'];
   		$dress = $_POST['dress'];
   		
   		
   		$sql = "INSERT INTO Customer (firstName,lastName,street,city,state,zipCode,phoneNumber,birthDate,picPath,shirtSize,pantSize,dressSize) VALUES ('$first','$last','$street','$city','$state','$zip','$phone','$birth','$pic','$shirt','$pant','$dress')";
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
<title>Customer - Registration</title>
<h3>Register</h3>
</hr>
</head>
<body>
<pre>
  		<form action="cust_register.php" method="post">
           
           First Name:<input type="text" name="firstName">
           Last Name:<input type="text" name="lastName">
           
           Street:<input type="text" name="street">
           City:<input type="text" name="city">
	   State(XX):<input type="text" name="state">
           Zip Code:<input type="text" name="zip">
	   Phone Number:<input type="text" name="phone">
           Birthdate YYYY-MM-DD:<input type="text" name="birthdate">
           Picture Path:<input type="text" name="pic">
           
           Shirt Size:<input type="text" name="shirt">
           Pants Size:<input type="text" name="pant">
           Dress Size:<input type="text" name="dress">
           <input type="submit" name="reg" value="Register">
        </form>
</pre>
</body>





</html>
