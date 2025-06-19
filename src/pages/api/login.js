// pages/api/login.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    let query 
    try {
        if (req.method == "POST") {
            const { userID, password } = req.body;
            const connection = await mysql.createConnection(db_info);
            
            query = `SELECT * FROM lashistas WHERE email = ?`;
            const [usuario] = await connection.execute(query, [userID]);
            if(usuario.length == 1){
                if(usuario[0].password == password){
                    res.status(200).json({ message: "welcome", usuarioID: usuario[0].id});
                } else {
                    res.status(403).json({message: "Wrong Password"});
                }
            } else {
                res.status(404).json({message: "User Not Found"});
            }
        }
    } catch (error) {
        res.status(500).json(error);
    } finally {
        if (connection) await connection.end();
    }
}
