var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'dbhost-mysql.cs.missouri.edu',
    user     : 'cs4970f12grp2',
    password : 'KUPDcAA4',
    database : 'cs4970f12grp2'
});

connection.connect();
console.log("Connected to MySQL");
connection.query('SELECT * from Customer', function(err, rows, fields) {
 
  if (err){  console.log(err); }
 
  else{       
    
    console.log('************** Results **************');   

       for (var i = 0; i < rows.length; i++){

           console.log(rows[i].firstName);
        
       } 

  }
  
});
connection.end();
