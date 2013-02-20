
function mysqlConnect() {
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'capstone'
});	
}

module.exports.mysqlConnect = mysqlConnect;
