const mysql = require ('mysql')
const { database } = require ('./keys.js')
const { promisify } = require ('util')

const pool = mysql.createPool(database)

pool.getConnection((err,connection)=>{
    if(err){
    if (err.code === 'PROTOCOL_CONNECTION_LOST'){
        console.error('database connection closed')
    }
    if (err.code === 'ER_CON_COUNT_ERROR'){
        console.error('database has to many connection')
    }
    if (err.code === 'ECONNREFUSED'){
        console.error('database connection refused')
    }
}
    if(connection)connection.release()
        console.log('db is connected')
        return
    



})

pool.query = promisify(pool.query)

module.exports = pool