import mysql from "mysql2/promise";
import { parse, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { parseQueryFilters, queryPlusFilters } from "@/utils/mobil/main";
import {
    generarHorarioDelDia,
    GenerarHorariosDisponibles,
    getAvailable,
    getSlots,
    refineHorarios,
    sortByHora,
} from "@/utils/mobil/disponibilidad";
import { filterTimeSlotsByRange } from "@/utils/detalles-citas";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    const connection = await mysql.createConnection({...db_info})
    try {
        if (req.method === "GET") {
            if (req.query.id) {
                const query = `SELECT 
                            citas.id as cita_ID,
                            servicios.image servicio_foto,
                            lashistas.image as lashista_foto, 
                            lashistas.nombre as lashista,
                            citas.cama_id,
                            servicios.servicio, 
                            servicios.minutos as duracion, 
                            citas.fecha,
                            citas.hora,
                            citas.metodo_pago,
                            servicios.precio,
                            servicios.precio_tarjeta,
                            citas.status,
                            citas.pagado,
                            clientas.id as clienta_id, 
                            clientas.foto_clienta, 
                            clientas.nombres as clienta_nombres, 
                            clientas.apellidos as clienta_apellidos, 
                            clientas.lada, 
                            clientas.telefono,
                            clientas.detalles_cejas
                        FROM 
                            citas
                        LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
                        LEFT JOIN clientas ON citas.clienta_id = clientas.id
                        LEFT JOIN servicios ON citas.servicio_id = servicios.id
                        WHERE citas.id = ?`;
                const [rows] = await connection.execute(query, [req.query.id]);
                res.status(200).json(rows[0]);
            }
            // Map query params to database columns
            // Also defining which filters are allowed (+ at parseQueryFilters)
            const filterMap = {
                date: "fecha",
                lashista: "lashista_id",
                // cama: "cama_id",
                // hora: "hora"
            };
            const { conditions, params } = parseQueryFilters(
                req.query,
                filterMap
            );
            console.log(conditions, params);

            let query = `SELECT 
                        citas.id as cita_ID, 
                        fecha, 
                        hora, 
                        status,
                        cama_id, 
                        clientas.nombres, 
                        clientas.apellidos, 
                        clientas.foto_clienta, 
                        servicios.id as servicio_id, 
                        servicios.servicio, 
                        servicios.precio, 
                        servicios.minutos as duracion, 
                        lashistas.nombre as lashista 
                    FROM 
                      citas 
                    LEFT JOIN clientas ON citas.clienta_id = clientas.id
                    LEFT JOIN servicios ON citas.servicio_id = servicios.id
                    LEFT JOIN lashistas ON citas.lashista_id = lashistas.id`;
            let fullQuery = queryPlusFilters(query, conditions);
            fullQuery = `${fullQuery} ORDER BY hora ASC`;

            const [rows] = await connection.execute(fullQuery, params);
            res.status(200).json(rows);
        } else {
            // Handle unsupported methods
            res.status(405).json({ error });
        }
    } catch (error) {
        res.status(500).json(error);
    } finally {
        await connection.end();
    }
}
