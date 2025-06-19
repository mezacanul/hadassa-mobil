import Descripcion from "@/components/common/Descripcion";
import Fotos from "@/components/common/Fotos";
import { CDN } from "@/config/cdn";
import { Badge, Button, Grid, Heading, HStack, Image, Text, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Citas() {
    const router = useRouter();
    const { citaID } = router.query;
    const [cita, setCita] = useState(null);
    const [fotos, setFotos] = useState(null)
    // const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        if (citaID) {
            axios.get(`/api/citas?id=${citaID}`).then((citaResp) => {
                console.log(citaResp.data);
                setCita(citaResp.data);
                axios.get(`/api/fotos_cejas?id=${citaResp.data.clienta_id}`).then((fotosResp) => {
                    console.log(fotosResp.data);
                    setFotos(fotosResp.data);
                })
            });
        }
    }, [router.isReady, citaID]);

    return (
        <VStack w={"100%"} gap={"2rem"}>
            {cita && <CitaTitle cita={cita} />}
            {cita && <CitaDetails cita={cita} />}
            {cita && <CitaContact cita={cita} />}
            <Fotos data={fotos} />
            {cita && <Descripcion data={cita.detalles_cejas} />}
        </VStack>
    )
}

function CitaContact({ cita }) {
    return (
        <VStack alignItems={"start"} w={"100%"}>
            <Heading w={"80%"} size={"2xl"}>{`${cita.clienta_nombres} ${cita.clienta_apellidos}`}</Heading>
            <Text>{`+${cita.lada} ${cita.telefono}`}</Text>
        </VStack>
    )
}

function CitaDetails({ cita }) {
    return (
        <HStack w={"100%"} justifyContent={"space-between"}>
            <VStack alignItems={"start"} gap={"0.3rem"}>
                <Heading>{cita.fecha}</Heading>
                <Text>{cita.fecha}</Text>
                <Text mb={"0.5rem"} fontWeight={700} color={"pink.500"}>{cita.hora}</Text>
                <Badge
                    py={"0.2rem"}
                    fontSize={"0.9rem"}
                    w={"100%"}
                    justifyContent={"center"}
                    fontWeight={700}
                    px={"1rem"}
                    className="light"
                    variant={"surface"}
                    colorPalette={"purple"} >{cita.duracion} mins.</Badge>
            </VStack>
            <Image
                shadow={"sm"}
                borderRadius={"full"}
                src={`${CDN}/img/clientas/${cita.foto_clienta ? cita.foto_clienta : "avatar-woman.png"}`}
                w={"7rem"}
            />
        </HStack>
    )
}

function CitaTitle({ cita }) {
    return (
        <HStack w={"100%"} justifyContent={"space-between"}>
            <Heading size={"2xl"}>{cita.servicio}</Heading>
            <Badge
                py={"0.2rem"}
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
    )
}