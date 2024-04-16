import mysql2 from "mysql2/promise"
import log from "../utilities/log.js";
import errors from "../utilities/errors.js";

async function dbConnection(){
    try{
            const connection = await mysql2.createPool({
                host: '127.0.0.1',
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            return connection
        }
        catch(err){
            log("MYSQL Baglantı Sorunu:"+err)
            return null
        }
}

export default async function newQuery(sql,data){
    let connection
    try {
        const pool = await dbConnection();
        if (pool) {
            connection = await pool.getConnection()
            connection.connect()
            const [rows,fields] = await connection.execute(sql,data)
            return rows
        }
        return errors.databaseConnectionErrorMessage();
    } 
    catch (error) {
        return errors.queryError(error)
    }
    finally{
        if (connection) {
            connection.release()
        }
    }
}