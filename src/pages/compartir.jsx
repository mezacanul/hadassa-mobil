import DatePicker_HC from "@/components/common/DatePicker_HC";
import SelectLashista from "@/components/common/SelectLashista";
import { CDN } from "@/config/cdn";
import { loadHook } from "@/utils/lattice-design";
import {
    Box,
    Button,
    Grid,
    Heading,
    HStack,
    Image,
    Select,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    RxDoubleArrowUp,
    RxDoubleArrowDown,
} from "react-icons/rx";
import { IoMdHome } from "react-icons/io";
import { useRouter as useNextNav } from "next/navigation";


const timeZone = "America/Mexico_City"; // GMT-6

export default function Compartir() {
    const today = format(new Date(), "yyyy-MM-dd");
    const [date, setDate] = useState(today);
    const router = useRouter();
    const [servicios, setServicios] = useState(null);
    const [lashista, setLashista] = useState(null);
    const [disponibles, setDisponibles] = useState(null);
    const [fechaStr, setFechaStr] = useState(null);
    const [loading, setLoading] = loadHook("useLoader");
    const [lashistaSelected, setLashistaSelected] =
        useState([]);
    const [consultando, setConsultando] = useState(false);
    const [showOpciones, setShowOpciones] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (router.isReady) {
            setFechaStr(getFechaStr(today));
            setLoading(false);
        }
    }, [router.isReady]);

    function consultarHorarios() {
        setConsultando(true);
        setLashista(null);
        setDisponibles(null);

        // setTimeout(() => {
        //     setConsultando(false);
        // }, 500);

        console.log(lashistaSelected);
        // return;

        Promise.all([
            axios.get("/api/servicios"),
            axios.get(
                `/api/lashistas?id=${lashistaSelected[0]}`
            ),
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

            const send = {
                action: "getHorariosDisponibles",
                dev: true,
                fecha: format(date, "dd-MM-yyyy"),
                lashista_id: null,
                servicio_id: null,
            };

            // console.log(send);

            const serviciosCalls = servicios.map((serv) =>
                // console.log({
                //     ...send,
                //     servicio_id: serv.id,
                //     lashista_id: lashistaSelected[0],
                // })

                axios.post("/api/disponibilidad", {
                    ...send,
                    servicio_id: serv.id,
                    lashista_id: lashistaSelected[0],
                })
            );

            // return;

            Promise.all(serviciosCalls).then(
                (disponiblesResp) => {
                    const disponiblesData =
                        disponiblesResp.map(
                            (dispResp, i) => ({
                                servicio:
                                    servicios[i].servicio,
                                horarios: dispResp.data,
                            })
                        );
                    console.log(disponiblesData);
                    setDisponibles(disponiblesData);
                    setConsultando(false);
                    setShowOpciones(false);
                    // setLoading(false);
                }
            );
        });
    }

    return (
        <div>
            <TituloPrincipal fechaStr={fechaStr} />

            {lashista && !consultando && (
                <LashistaInfo lashista={lashista} />
            )}

            {date && (
                <Opciones
                    lashistaSelected={lashistaSelected}
                    setLashistaSelected={
                        setLashistaSelected
                    }
                    date={date}
                    setDate={setDate}
                    setFechaStr={setFechaStr}
                    consultando={consultando}
                    consultarHorarios={consultarHorarios}
                    showOpciones={showOpciones}
                    setShowOpciones={setShowOpciones}
                    disponibles={disponibles}
                    setLoading={setLoading}
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

function Opciones({
    lashistaSelected,
    setLashistaSelected,
    date,
    setDate,
    setFechaStr,
    consultando,
    consultarHorarios,
    showOpciones,
    setShowOpciones,
    disponibles,
    setLoading
}) {
    const NextNav = useNextNav();
    
    return (
        <VStack
            mt={!showOpciones ? "0.5rem" : "1rem"}
            mb={showOpciones ? "2rem" : "1.5rem"}
        >
            <VStack
                my={"1rem"}
                w={"100%"}
                alignItems={"center"}
                gap={"0.5rem"}
                display={
                    showOpciones && !consultando
                        ? "flex"
                        : "none"
                }
            >
                <SelectLashista
                    w="100%"
                    lashista={lashistaSelected}
                    setLashista={setLashistaSelected}
                />
                <DatePicker_HC
                    w="100%"
                    date={date}
                    setDate={(val) => {
                        // console.log(val);
                        setDate(val);
                        setFechaStr(getFechaStr(val));
                    }}
                />

                {!consultando && (
                    <Grid
                        w={"100%"}
                        gridTemplateColumns={"1fr 1fr"}
                        gap={"0.5rem"}
                    >
                        <Button
                            // w={"100%"}
                            bg={"pink.500"}
                            shadow={"sm"}
                            color={"white"}
                            onClick={consultarHorarios}
                            disabled={
                                lashistaSelected.length == 0
                                    ? true
                                    : false
                            }
                        >
                            Consultar
                        </Button>
                        <Button
                            // w={"100%"}
                            bg={"pink.500"}
                            shadow={"sm"}
                            color={"white"}
                            colorPalette={"blue"}
                            onClick={()=>{
                                NextNav.push(`/`);
                                setLoading(true)
                            }}
                        >
                            <IoMdHome/>
                        </Button>
                    </Grid>
                )}
            </VStack>

            {consultando && (
                <HStack
                    my={"4rem"}
                    w={"100%"}
                    justifyContent={"center"}
                >
                    <Spinner
                        size={"xl"}
                        color={"pink.500"}
                        borderWidth={"3px"}
                    />
                </HStack>
            )}

            {showOpciones && disponibles && (
                <Heading
                    textAlign={"center"}
                    color={"pink.500"}
                    size={"3xl"}
                    onClick={() => {
                        setShowOpciones(false);
                    }}
                >
                    <RxDoubleArrowUp />
                </Heading>
            )}

            {!showOpciones && (
                <Heading
                    textAlign={"center"}
                    color={"pink.500"}
                    size={"3xl"}
                    onClick={() => {
                        setShowOpciones(true);
                    }}
                >
                    <RxDoubleArrowDown />
                </Heading>
            )}
        </VStack>
    );
}

function LashistaInfo({ lashista }) {
    return (
        <VStack
            // mb={"2rem"}
            mt={"2rem"}
            w={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={"2rem"}
        >
            <VStack>
                {lashista && (
                    <Image
                        rounded={"full"}
                        shadow={"sm"}
                        w={"5.5rem"}
                        src={`${CDN}/img/lashistas/${lashista.image}`}
                    />
                )}
                <Heading
                    fontWeight={500}
                    color={"pink.600"}
                    size={"xl"}
                >
                    {lashista && lashista.nombre}
                </Heading>
            </VStack>
        </VStack>
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
        <Box w={"100%"}>
            <Heading
                textAlign={"center"}
                mb={"1rem"}
                fontWeight={500}
            >
                {disp.servicio}
            </Heading>
            <Grid
                // w={"100%"}
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
                                textAlign={"center"}
                                fontWeight={700}
                            >
                                {hr.hora
                                    .replace("-", "*")
                                    .replace("+", "*")}
                            </Box>
                        );
                    })}
            </Grid>

            {disp.horarios.length == 0 && (
                <Text textAlign={"center"}>
                    No hay horarios disponibles
                </Text>
            )}
        </Box>
    );
}

function TituloPrincipal({ fechaStr }) {
    return (
        <VStack gap={"0.3rem"}>
            <Heading
                size={"lg"}
                fontWeight={400}
            >
                {"Horarios Disponibles"}
            </Heading>
            <Heading
                color={"pink.500"}
                size={"2xl"}
                fontWeight={700}
            >
                {fechaStr && fechaStr}
            </Heading>
        </VStack>
    );
}

function getFechaStr(date) {
    const zonedDate = toZonedTime(
        new Date(`${date}T00:00:00`),
        timeZone
    );
    const formattedDate = format(
        zonedDate,
        "EEEE dd 'de' MMMM",
        { locale: es }
    );

    const capitalizedDate = formattedDate
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

    return capitalizedDate;
}
