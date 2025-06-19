// pages/api/servicios.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    const lashista_ID = req.query.id ? req.query.id : "";
    let query;

    const connection = await mysql.createConnection({...db_info})

    try {
        if(lashista_ID){
            query = `SELECT * FROM camas WHERE lashista_id = ?`
        } else {
            query = `SELECT 
                        camas.id, 
                        lashistas.nombre as title, 
                        lashistas.image as src 
                    FROM 
                        camas 
                    LEFT JOIN 
                        lashistas 
                    ON camas.lashista_id = lashistas.id`
        }

        const [rows] = await connection.execute(query, [lashista_ID])
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}
