var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'capstone'
});

connection.connect();

connection.query('SELECT * FROM Employees', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows);
});

connection.end();
