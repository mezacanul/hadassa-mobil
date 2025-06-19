// pages/api/clientas.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    let query;
    const connection = await mysql.createConnection(db_info);

    try {
        if (req.method === "GET") {
            const clientaID = req.query.id ? req.query.id : "";
            if (clientaID) {
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

        if (req.method === "PATCH") {
            const { clienta, descripcion } = req.body;
            // res.status(200).json({ clienta, descripcion });

            query = `UPDATE clientas SET detalles_cejas = ? WHERE id = ?`;
            const [result] = await connection.execute(query, [descripcion, clienta]);

            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ error: "Clienta not found or no change" });
            }

            res.status(200).json({
                message: "success",
                affectedRows: result.affectedRows,
            });
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        // Close the connection
        await connection.end();
    }
}
