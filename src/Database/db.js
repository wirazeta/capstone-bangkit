// database adalah db_api dengan tavel bernama members
const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : '35.239.104.145',
  user            : 'admin',
  Password        : '',
  database        : 'petang_database'
});

var getConnection = (callback) => {
  pool.getConnection((err, connection) => {
      callback(err, connection);
    });
};

module.exports = {
	getConn: getConnection,
}