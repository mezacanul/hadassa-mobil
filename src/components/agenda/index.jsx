import {
    Badge,
    Box,
    Button,
    createListCollection,
    Heading,
    HStack,
    Image,
    Input,
    Portal,
    Select,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaRegCalendar } from "react-icons/fa";
import MainButton from "../common/MainButton";
import { useRouter as useNextNav } from "next/navigation";
import { loadHook } from "@/utils/lattice-design";
import axios from "axios";
import { CDN } from "@/config/cdn";
import { FaClock } from "react-icons/fa6";
import { format } from "date-fns";
import { getCamaTitle } from "@/utils/mobil/main";

export default function Agenda({ lashistaID, setCurrentLashista }) {
    const today = format(new Date(), "yyyy-MM-dd");
    const [lashista, setLashista] = useState(null);
    const [date, setDate] = loadHook("useDate");
    const [cama, setCama] = useState("ambas");
    const [loading, setLoading] = loadHook("useLoader");
    const [usuario] = loadHook("useUsuario");
    // const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))

    useEffect(() => {
        console.log("Rol:", usuario.rol);
        setDate(today);
        Promise.all([
            axios.get(`/api/lashistas?id=${lashistaID}`),
            // axios.get(`/api/camas?id=${usuarioID}`),
        ]).then(([lashistaResp]) => {
            // console.log(camasResp);
            setLashista(lashistaResp.data[0]);
            setLoading(false);
        });
    }, []);

    return (
        <>
            {usuario.rol != "lashista" ? (
                <Button
                    w={"100%"}
                    mb={"1rem"}
                    shadow={"sm"}
                    bg={"pink.500"}
                    color={"white"}
                    fontWeight={700}
                    onClick={()=>{
                        setCurrentLashista(null)
                    }}
                >
                    Regresar
                </Button>
            ) : (
                ""
            )}
            <VStack
                w={"100%"}
                gap={"3rem"}
            >
                {!lashista && (
                    <HStack
                        w={"100%"}
                        justifyContent={"center"}
                    >
                        <Spinner
                            color={"pink.500"}
                            size={"xl"}
                        />
                    </HStack>
                )}
                {lashista && (
                    <>
                        <Lashista lashista={lashista} />
                        <AccionesAgenda
                            today={today}
                            date={date}
                            setDate={setDate}
                            cama={cama}
                            setCama={setCama}
                            lashistaID={lashistaID}
                        />
                        <Citas
                            lashistaID={lashistaID}
                            date={date}
                            cama={cama}
                        />
                    </>
                )}
            </VStack>
        </>
    );
}

function Citas({ lashistaID, date, cama }) {
    const [citas, setCitas] = useState(null);

    useEffect(() => {
        // console.log(usuarioID, date, cama);
        updateCitas();
    }, []);

    useEffect(() => {
        setCitas(null);
        updateCitas();
    }, [date]);

    const updateCitas = () => {
        // console.log(usuarioID, date);
        axios
            .get(
                `/api/citas?lashista=${lashistaID}&date=${date}`
            )
            .then((citasResp) => {
                // console.log(citasResp);
                setCitas(citasResp.data);
            });
    };

    return (
        <VStack
            w={"100%"}
            gap={"2rem"}
        >
            {!citas && (
                <Spinner
                    size={"lg"}
                    color={"pink.500"}
                />
            )}
            {citas && citas.length == 0 && (
                <VStack>
                    <Heading mt={"2rem"}>
                        No hay citas
                    </Heading>
                </VStack>
            )}
            {citas &&
                citas
                    .filter((cita) => {
                        if (cama != "ambas") {
                            return cita.cama_id == cama[0];
                        } else {
                            return true;
                        }
                    })
                    .map((cita, idx) => {
                        return (
                            <CitaCard
                                key={idx}
                                data={cita}
                            />
                        );
                    })}
        </VStack>
    );
}

function CitaCard({ data }) {
    const NextNav = useNextNav();
    const [loading, setLoading] = loadHook("useLoader");

    return (
        <VStack
            bg={"white"}
            shadow={"sm"}
            alignItems={"start"}
            onClick={() => {
                setLoading(true);
                NextNav.push(`/citas/${data.cita_ID}`);
            }}
            className="light"
            gap={"1rem"}
            py={"1rem"}
            px={"1.5rem"}
            w={"100%"}
            borderColor={"pink.600"}
            borderWidth={"2px"}
            borderRadius={"0.5rem"}
        >
            <HStack
                w={"100%"}
                gap={"1.5rem"}
                justifyContent={"space-between"}
            >
                <Image
                    src={`${CDN}/img/clientas/${
                        data.foto_clienta
                            ? data.foto_clienta
                            : "avatar-woman.png"
                    }`}
                    w={"7rem"}
                />
                <VStack alignItems={"end"}>
                    <Heading
                        textAlign={"right"}
                        fontWeight={800}
                    >
                        {data.servicio}
                    </Heading>
                    <Text>{data.fecha}</Text>
                    <HStack>
                        <Text>{data.hora}</Text>
                        <Text color="pink.600">
                            <FaClock />
                        </Text>
                    </HStack>
                    <Badge
                        px={"1rem"}
                        fontWeight={700}
                        variant={"surface"}
                        colorPalette={"blue"}
                    >
                        {getCamaTitle(data.cama_id)}
                    </Badge>
                </VStack>
            </HStack>

            <Heading
                w={"80%"}
                fontWeight={700}
                color={"pink.600"}
            >
                {`${data.nombres} ${data.apellidos}`}
            </Heading>

            <HStack
                w={"100%"}
                justifyContent={"space-between"}
            >
                <Badge
                    px={"1rem"}
                    fontWeight={700}
                    variant={"surface"}
                    colorPalette={
                        (data.status == 0 && "red") ||
                        (data.status == 1 && "yellow") ||
                        (data.status == 2 && "green")
                    }
                >
                    {data.status == 0 && "Cancelada"}
                    {data.status == 1 && "Pendiente"}
                    {data.status == 2 && "Confirmada"}
                </Badge>
                <Badge
                    px={"1rem"}
                    fontWeight={700}
                    variant={"surface"}
                    colorPalette={"purple"}
                >
                    {data.duracion} mins.
                </Badge>
            </HStack>
        </VStack>
    );
}

function Lashista({ lashista }) {
    const horariosLV = JSON.parse(lashista.horarioLV);

    return (
        <HStack
            w={"100%"}
            gap={"1.5rem"}
        >
            <Image
                shadow={"sm"}
                rounded={"lg"}
                src={`${CDN}/img/lashistas/${lashista.image}`}
                w={"7rem"}
            />
            <VStack alignItems={"start"}>
                <Heading size={"2xl"}>
                    {lashista.nombre}
                </Heading>
                {horariosLV.map((hlv, idx) => {
                    return (
                        <HStack key={idx}>
                            <Text color="pink.600">
                                <FaClock />
                            </Text>
                            <Text>{hlv}</Text>
                        </HStack>
                    );
                })}
            </VStack>
        </HStack>
    );
}

function AccionesAgenda({
    today,
    date,
    setDate,
    cama,
    setCama,
    lashistaID,
}) {
    useEffect(() => {
        console.log("comparison", today, date);
    }, []);
    return (
        <VStack
            w={"100%"}
            gap={"1rem"}
        >
            <HStack w={"100%"}>
                <DatePicker_HC
                    date={date}
                    setDate={setDate}
                />
                <MainButton
                    opacity={date == today ? 0.6 : 1}
                    disabled={date == today ? true : false}
                    variant="solid"
                    w={"6rem"}
                    onClick={() => {
                        setDate(
                            format(new Date(), "yyyy-MM-dd")
                        );
                    }}
                >
                    Hoy
                </MainButton>
            </HStack>
            <CamasSelect
                cama={cama}
                setCama={setCama}
                lashistaID={lashistaID}
            />
        </VStack>
    );
}

function CamasSelect({ cama, setCama, lashistaID }) {
    // const [usuarioID] = loadHook("useUsuarioID")
    const [camas, setCamas] = useState(null);

    useEffect(() => {
        const items = [
            { label: "Ambas Camas", value: "ambas" },
        ];

        axios
            .get(`/api/camas?id=${lashistaID}`)
            .then((camasResp) => {
                // console.log(camasResp.data);
                camasResp.data.forEach((cama) => {
                    items.push({
                        label: getCamaTitle(cama.id),
                        value: cama.id,
                    });
                });
                const camasColl = createListCollection({
                    items,
                });
                setCamas(camasColl);
            });
    }, []);
    return (
        <>
            {!camas && (
                <HStack
                    w={"100%"}
                    justifyContent={"center"}
                >
                    <Spinner color={"pink.500"} />
                </HStack>
            )}
            {camas && (
                <Select.Root
                    collection={camas}
                    width="320px"
                    value={cama}
                    defaultValue={"ambas"}
                    onValueChange={(e) => setCama(e.value)}
                    backgroundColor={"white"}
                    w={"100%"}
                >
                    <Select.HiddenSelect />
                    <Select.Control w={"100%"}>
                        <Select.Trigger
                            borderColor={"pink.500"}
                            borderWidth={"2px"}
                        >
                            <Select.ValueText
                                placeholder="Ambas Camas"
                                color={"pink.500"}
                                fontWeight={700}
                                textAlign={"center"}
                            />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator
                                color={"pink.500"}
                            />
                        </Select.IndicatorGroup>
                    </Select.Control>

                    <Portal>
                        <Select.Positioner w={"100%"}>
                            <Select.Content
                                backgroundColor={"white"}
                                w={"100%"}
                            >
                                {camas.items.map(
                                    (opt, idx) => (
                                        <Select.Item
                                            item={opt}
                                            key={opt.value}
                                            color={
                                                "pink.600"
                                            }
                                            _selected={
                                                idx == 0
                                                    ? true
                                                    : false
                                            }
                                            bg={"white"}
                                        >
                                            {opt.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    )
                                )}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            )}
        </>
    );
}

function DatePicker_HC({ date, setDate }) {
    return (
        <Box
            w={"100%"}
            h={"100%"}
            position={"relative"}
        >
            <style>
                {`input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) brightness(0.8); /* Adjust for white or other colors */
                }`}
            </style>
            <Input
                bg={"white"}
                top={0}
                color={"pink.500"}
                borderColor={"pink.500"}
                borderWidth={"2px"}
                zIndex={0}
                value={date}
                onChange={(e) => {
                    setDate(e.target.value);
                }}
                type="date"
                fontWeight={700}
            />
        </Box>
    );
}
