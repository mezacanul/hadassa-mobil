import mysql from "mysql2/promise";
import { parse, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import {
    formatFechaDMY,
    formatFechaYMD,
    getDayIndexNumber,
    getHorarioByDayNumber,
    getMinutes,
    parseQueryFilters,
    queryPlusFilters,
} from "@/utils/main";
import {
    canSchedule,
    generarHorarioDelDia,
    GenerarHorariosDisponibles,
    getAvailable,
    getEventSlots,
    getEventSlotsBackwards,
    getSlots,
    refineHorarios,
    sortByHora,
} from "@/utils/disponibilidad";
import { filterTimeSlotsByRange } from "@/utils/detalles-citas";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    const connection = await mysql.createConnection(
        db_info
    );

    try {
        if (req.method === "POST") {
            // Detalles de la CITA a agendar.
            const POST_Data = req.body;
            const cita = {
                fecha: req.body.fecha,
                servicio_id: req.body.servicio_id
                    ? req.body.servicio_id
                    : null,
                lashista_id: req.body.lashista_id
                    ? req.body.lashista_id
                    : null,
            };

            // let citaDetalles = {};
            let lashista = {};
            let servicios = [];
            let camasKeys = [];
            let citasPorCama = [];
            let horariosDispPorCama = {};
            // let disponibilidad = {};
            // let camaDisponible = null;
            let horarioLashista = [];
            const parsedDate = parse(
                cita.fecha,
                "dd-MM-yyyy",
                new Date()
            );
            const dayName = format(parsedDate, "eeee", {
                locale: enUS,
            }); // Use 'eeee' for English
            const horarioDelDia = generarHorarioDelDia({
                weekend: ["Saturday", "Sunday"].includes(
                    dayName
                ),
            });

            // let citasDelDia = []

            let [citasDelDia] = await connection.execute(
                `SELECT 
                        servicio_id, 
                        servicios.servicio, 
                        fecha, 
                        hora, 
                        duracion as minutos, 
                        cama_id
                    FROM 
                        citas 
                    LEFT JOIN clientas ON citas.clienta_id = clientas.id
                    LEFT JOIN servicios ON citas.servicio_id = servicios.id
                    LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
                    WHERE fecha = '${cita.fecha}' AND citas.lashista_id = '${cita.lashista_id}' AND citas.status != 0`
                // Date format for CITAS table, FECHA column: 'YYYY-MM-DD'
            );
            [servicios] = await connection.execute(
                `SELECT id, servicio, minutos, reglas_agenda FROM servicios`
            );
            [camasKeys] = await connection.execute(
                `SELECT id FROM camas WHERE lashista_id = '${cita.lashista_id}'`
            );
            [lashista] = await connection.execute(
                `SELECT * FROM lashistas WHERE id = '${cita.lashista_id}'`
            );

            let [eventos] = await connection.execute(
                `SELECT 
                    *, 
                    lashistas.nombre as lashista
                FROM 
                    eventos 
                LEFT JOIN lashistas ON eventos.id_lashista = lashistas.id
                WHERE 
                    fecha_init = '${formatFechaYMD(
                        cita.fecha
                    )}'
                    AND id_lashista = '${cita.lashista_id}'
                    AND status = 1`
            );

            camasKeys = camasKeys.map((cama) => cama.id);
            lashista = lashista.reduce((acc, item) => {
                Object.keys(item).forEach(
                    (prop) => (acc[prop] = item[prop])
                );
                return acc;
            }, {});
            servicios = Object.fromEntries(
                servicios.map((servicio) => [
                    servicio.id,
                    {
                        servicio: servicio.servicio,
                        minutos: servicio.minutos,
                        regla: servicio.reglas_agenda,
                    },
                ])
            );

            eventos = formatEventosForAvailableCalculation(
                eventos,
                lashista,
                formatFechaYMD(cita.fecha)
            );

            horarioLashista = [
                "Saturday",
                "Sunday",
            ].includes(dayName)
                ? lashista.horarioSBD
                : lashista.horarioLV;
            let horarioLashistaArray =
                filterTimeSlotsByRange(
                    horarioDelDia,
                    horarioLashista
                );
            
            camasKeys.forEach(
                (camaID) =>
                    (horariosDispPorCama[camaID] = [
                        ...horarioLashistaArray,
                    ])
            );

            if (citasDelDia.length > 0) {
                citasPorCama = citasDelDia.reduce(
                    (acc, item) => {
                        const { cama_id } = item;
                        acc[cama_id] = acc[cama_id] || [];
                        acc[cama_id].push(item);
                        return acc;
                    },
                    {}
                );

                horariosDispPorCama =
                    GenerarHorariosDisponibles(
                        camasKeys,
                        citasPorCama,
                        horariosDispPorCama,
                        servicios,
                        horarioDelDia
                    );
            }

            if (
                POST_Data.action ==
                    "getHorariosDisponibles" &&
                req.body.dev
            ) {
                const available = getAvailable(
                    horariosDispPorCama,
                    cita,
                    horarioDelDia,
                    servicios,
                    req.body.dev
                );

                let availableArr = refineHorarios(
                    available,
                    camasKeys
                );
                availableArr = sortByHora(availableArr);

                if (eventos.length > 0) {
                    const evento = eventos[0];
                    const eventSlots = getEventSlots(
                        evento.hora,
                        evento.minutos
                    );
                    const minutosCita =
                        servicios[cita.servicio_id].minutos;
                    const eventSlotsBackwards =
                        getEventSlotsBackwards(
                            evento.hora,
                            minutosCita
                        );

                    // console.log(availableArr, servicios[cita.servicio_id], eventSlotsBackwards);

                    availableArr = availableArr.filter(
                        (available) => {
                            return !eventSlots.includes(
                                available.hora
                            );
                        }
                    );
                    availableArr = availableArr.filter(
                        (available) => {
                            return !eventSlotsBackwards.includes(
                                available.hora
                            );
                        }
                    );
                }

                console.log("TEST - YES DEV");
                console
                    .log
                    // eventos,
                    // servicios[cita.servicio_id],
                    // availableArr
                    // horariosDispPorCama
                    // citasDelDia[0],
                    // lashista
                    ();

                // Final response
                res.status(200).json(availableArr);
            } else {
                res.status(200).json(
                    "Something is missing here... 🛠️"
                );
            }
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

function formatEventosForAvailableCalculation(
    eventos,
    lashista,
    fecha
) {
    const dayNumber = getDayIndexNumber(fecha);
    const horario = getHorarioByDayNumber(
        lashista,
        dayNumber
    );

    return eventos.map((ev) => ({
        servicio_id: ev.tipo,
        servicio: ev.titulo,
        fecha: formatFechaDMY(ev.fecha_init),
        hora: ev.hora_init ? ev.hora_init : horario[0],
        minutos: ev.hora_fin
            ? getMinutes(ev.hora_init, ev.hora_fin)
            : getMinutes(horario[0], horario[1]),
        cama_id: `cama-${ev.lashista.toLowerCase()}-1`,
    }));
}
