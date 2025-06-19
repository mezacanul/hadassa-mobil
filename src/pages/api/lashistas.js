// pages/api/lashistas.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    const lashista_ID = req.query.id ? req.query.id : ""
    let query
    const connection = await mysql.createConnection({
        host: db_info.host,
        port: db_info.port,
        user: db_info.user,
        password: db_info.password,
        database: db_info.database,
    });

    try {
        if(lashista_ID){
            query = `SELECT 
                        * 
                    FROM 
                        lashistas 
                    WHERE id = ?
                    ORDER BY nombre ASC`
        } else {
            // Query the lashistas table
            query = "SELECT * FROM lashistas ORDER BY nombre ASC"
        }
        
        const [rows] = await connection.execute(query, [lashista_ID])
        // Send the results as an array
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json(error);
    } finally {
        // Close the connection
        await connection.end();
    }
}
