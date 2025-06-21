import Descripcion from "@/components/common/Descripcion";
import Fotos from "@/components/common/Fotos";
import { CDN } from "@/config/cdn";
import { capitalizeFirst, getCamaTitle } from "@/utils/main";
import { Badge, Button, Grid, Heading, HStack, Image, Text, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaClock } from "react-icons/fa";
import { loadHook } from "@/utils/lattice-design";
import { FaWhatsapp } from "react-icons/fa";


export default function Citas() {
    const router = useRouter();
    const { citaID } = router.query;
    const [cita, setCita] = useState(null);
    const [fotos, setFotos] = useState(null)
    const [loading, setLoading] = loadHook("useLoader")

    useEffect(() => {
        if (citaID) {
            axios.get(`/api/citas?id=${citaID}`).then((citaResp) => {
                console.log(citaResp.data);
                setCita(citaResp.data);
                setLoading(false)
                axios.get(`/api/fotos_cejas?id=${citaResp.data.clienta_id}`).then((fotosResp) => {
                    console.log(fotosResp.data);
                    setFotos(fotosResp.data);
                })
            });
        }
    }, [router.isReady, citaID]);

    return (
        <VStack w={"100%"} gap={"2rem"}>
            {cita && (
                <>
                    <CitaTitle cita={cita} />
                    <CitaContact cita={cita} />
                    <CitaDetails cita={cita} />
                    <Fotos data={fotos} clienta={cita.clienta_id} />
                    <Descripcion data={cita.detalles_cejas} clienta={cita.clienta_id} />
                </>
            )}
        </VStack>
    )
}

function CitaContact({ cita }) {
    return (
        <VStack pb={"2rem"} justifyContent={"space-between"} alignItems={"center"} w={"100%"} gap={"0.5rem"} borderBottom={"1px solid gray"}>
            <Heading color={"pink.600"} textAlign={"center"} size={"2xl"}>{`${cita.clienta_nombres} ${cita.clienta_apellidos}`}</Heading>
            <Text>{`+${cita.lada} ${cita.telefono}`}</Text>
            {/* <Button size={"lg"} colorPalette={"green"}><FaWhatsapp/> Recordatorio</Button> */}
        </VStack>
    )
}

const badgeStyles = {
    py: "0.2rem",
    fontSize: "0.9rem",
    w: "100%",
    justifyContent: "center",
    fontWeight: 700,
    px: "1rem",
    className: "light",
    variant: "surface"
}

function CitaDetails({ cita }) {
    const [dateObj, setDateObj] = useState(null)

    useEffect(() => {
        // console.log("test", date);
        const parsedDate = parse(cita.fecha, 'dd-MM-yyyy', new Date());

        const obj = {
            dayName: capitalizeFirst(format(parsedDate, "EEEE dd", { locale: es })), // "Jueves 19" 
            monthYearFormat: capitalizeFirst(format(parsedDate, "MMMM 'de' yyyy", { locale: es })) // "Junio de 2025"
        }
        console.log(obj);

        setDateObj(obj)
    }, [])

    return (
        <HStack pb={"2rem"} borderBottom={"1px solid grey"} w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
            <VStack alignItems={"start"} gap={"0.8rem"}>
                <VStack alignItems={"start"} gap={0}>
                    <Heading size={"2xl"}>{dateObj && dateObj.dayName}</Heading>
                    <Text color={"pink.600"}>{dateObj && dateObj.monthYearFormat}</Text>
                </VStack>
                {/* <HStack>
                    <Text color="pink.600"><FaClock /></Text>
                    <Text fontWeight={700}>{cita.hora}</Text>
                </HStack> */}
                <Badge
                    {...badgeStyles}
                    colorPalette={"purple"}
                >
                    {cita.duracion} mins.
                </Badge>
                {/* <Badge
                    {...badgeStyles}
                    colorPalette={"blue"}
                >
                    {getCamaTitle(cita.cama_id)}
                </Badge> */}
            </VStack>
            <Image
                shadow={"sm"}
                borderRadius={"lg"}
                src={`${CDN}/img/clientas/${cita.foto_clienta ? cita.foto_clienta : "avatar-woman.png"}`}
                w={"7rem"}
            />
        </HStack>
    )
}

function CitaTitle({ cita }) {
    return (
        <VStack gap={"1rem"} pb={"1rem"} w={"100%"} alignItems={"center"} justifyContent={"space-between"} borderBottom={"1px solid gray"}>
            <Heading w={"85%"} textAlign={"center"} size={"2xl"}>{cita.servicio}</Heading>
            <Badge
            style={{width: "7rem"}}
                width={"5rem"}
                {...badgeStyles}
                colorPalette={"blue"}
            >
                {getCamaTitle(cita.cama_id)}
            </Badge>
            <HStack w={"100%"} justifyContent={"space-between"}>
                <HStack>
                    <Text color="pink.600"><FaClock /></Text>
                    <Text fontWeight={700}>{cita.hora}</Text>
                </HStack>
                <Badge
                    py={"0.3rem"}
                    fontSize={"0.9rem"}
                    fontWeight={700}
                    px={"1rem"}
                    className="light"
                    variant={"surface"}
                    colorPalette={
                        cita.status == 0 && "red" ||
                        cita.status == 1 && "yellow" ||
                        cita.status == 2 && "green"
                    }
                >
                    {cita.status == 0 && "Cancelada"}
                    {cita.status == 1 && "Pendiente"}
                    {cita.status == 2 && "Confirmada"}
                </Badge>
            </HStack>
        </VStack>
    )
}