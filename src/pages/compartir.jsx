import { CDN } from "@/config/cdn";
import {
    Box,
    Grid,
    Heading,
    HStack,
    Image,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Compartir() {
    const router = useRouter();
    const [servicios, setServicios] = useState(null);
    const [lashista, setLashista] = useState(null);
    const [disponibles, setDisponibles] = useState(null);
    const [fechaStr, setFechaStr] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            const { lashista, fecha } = router.query;
            const send = {
                action: "getHorariosDisponibles",
                dev: true,
                fecha,
                lashista_id: null,
                servicio_id: null,
            };
            setFechaStr(fecha);

            Promise.all([
                axios.get("/api/servicios"),
                axios.get(`/api/lashistas?id=${lashista}`),
            ]).then(([axiosResp, lashistaResp]) => {
                console.log(lashistaResp.data[0]);
                setLashista(lashistaResp.data[0]);
                const servicios = axiosResp.data;
                const serviciosIndexed = {};
                servicios.forEach((serv) => {
                    serviciosIndexed[serv.id] = serv;
                });
                console.log(serviciosIndexed);
                setServicios(serviciosIndexed);
                // return

                const serviciosCalls = servicios.map(
                    (serv) =>
                        axios.post("/api/disponibilidad", {
                            ...send,
                            servicio_id: serv.id,
                            lashista_id: lashista,
                        })
                );

                Promise.all(serviciosCalls).then(
                    (disponiblesResp) => {
                        const disponiblesData =
                            disponiblesResp.map(
                                (dispResp, i) => ({
                                    servicio:
                                        servicios[i]
                                            .servicio,
                                    horarios: dispResp.data,
                                })
                            );
                        console.log(disponiblesData);
                        setDisponibles(disponiblesData);
                    }
                );

                // axios
                //     .post(
                //         "/api/disponibilidad",
                //         servicios[0]
                //     )
                //     .then((axiosResp2) => {
                //         setDisponibles(1)
                //         console.log(axiosResp2);
                //     });
            });
        }
    }, [router.isReady]);

    return (
        <div>
            <VStack
                mb={"2rem"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                {/* <HStack> */}
                {lashista && (
                    <Image
                        rounded={"full"}
                        shadow={"sm"}
                        w={"6rem"}
                        src={`${CDN}/img/lashistas/${lashista.image}`}
                    />
                )}
                <Heading color={"pink.600"} size={"3xl"}>
                    {lashista && lashista.nombre}
                </Heading>
                {/* </HStack> */}
                <Heading>{"Horarios Disponibles"}</Heading>
                <Text>{fechaStr && fechaStr}</Text>
            </VStack>

            {!disponibles && (
                <Spinner
                    size={"lg"}
                    borderWidth={"4px"}
                />
            )}
            {disponibles && (
                <ServiciosYHorarios
                    disponibles={disponibles}
                />
            )}
        </div>
    );
}

function ServiciosYHorarios({ disponibles }) {
    return (
        <VStack
            alignItems={"center"}
            gap={"2rem"}
        >
            {disponibles.map((disp, idx) => {
                return (
                    <ServicioInfo
                        key={idx}
                        disp={disp}
                    />
                );
            })}
        </VStack>
    );
}

function ServicioInfo({ disp }) {
    return (
        <Box>
            <Heading textAlign={"center"} mb={"1rem"}>{disp.servicio}</Heading>
            <Grid
                w={"100%"}
                gap={"0.5rem"}
                gridTemplateColumns={"1fr 1fr 1fr 1fr"}
            >
                {disp.horarios.length > 0 &&
                    disp.horarios.map((hr, i) => {
                        return (
                            <Box
                                key={i}
                                px={"0.8rem"}
                                py={"0.5rem"}
                                bg={"pink.500"}
                                rounded={"sm"}
                                color={"white"}
                                shadow={"sm"}
                            >
                                {hr.hora.replace("-", "*")}
                            </Box>
                        );
                    })}
            </Grid>

            {disp.horarios.length == 0 && (
                <Text>No hay horarios disponibles</Text>
            )}
        </Box>
    );
}
