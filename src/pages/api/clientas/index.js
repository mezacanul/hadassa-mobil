// pages/api/clientas.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    let query;
    const connection = await mysql.createConnection(db_info);

    try {
        if (req.method === "GET") {
            const clientaID = req.query.id ? req.query.id : ""
            if(clientaID){
                query = `SELECT 
                                * 
                            FROM 
                                clientas 
                            WHERE id = ?
                            ORDER BY nombres ASC, apellidos ASC`;
            } else {
                query = `SELECT 
                                * 
                            FROM 
                                clientas 
                            ORDER BY nombres ASC, apellidos ASC`;
            }
            const [rows] = await connection.execute(query, [clientaID]);
            res.status(200).json(rows);
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        // Close the connection
        await connection.end();
    }
}
