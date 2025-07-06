// pages/api/servicios.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    const connection = await mysql.createConnection({
        ...db_info,
    });

    try {
        let query = `SELECT * FROM servicios`;
        const [rows] = await connection.execute(query);
        
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}
