import mysql from 'mysql'

const connection = mysql.createConnection({
	host: '192.168.3.25',
	user: 'admin',
	password: 'admin',
	port: '3306',
	database: 'yhb_29'
});

connection.connect()

console.log('asgagag')
console.log(connection)


export default connection