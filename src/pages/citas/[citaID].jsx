import Descripcion from "@/components/common/Descripcion";
import Fotos from "@/components/common/Fotos";
import { Badge, Button, Grid, Heading, HStack, Image, Text, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Citas() {
    const router = useRouter();
    const { citaID } = router.query;
    const [cita, setCita] = useState(null);
    // const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        if (citaID) {
            axios.get(`/api/citas?id=${citaID}`).then((citaResp) => {
                console.log(citaResp.data);
                setCita(citaResp.data);
                // setLoading(false);
            });
        }
    }, [router.isReady, citaID]);

    return (
        <VStack w={"100%"} gap={"2rem"}>
            {cita && <CitaTitle cita={cita} />}
            {cita && <CitaDetails cita={cita} />}
            {cita && <CitaContact cita={cita} />}
            {cita && <Fotos cita={cita} />}
            {cita && <Descripcion cita={cita} />}
        </VStack>
    )
}

function CitaContact({ cita }) {
    return (
        <VStack alignItems={"start"} w={"100%"}>
            <Heading w={"80%"} size={"2xl"}>Naomy Aracelly Alcocer Arceo</Heading>
            <Text>+52 9993524438</Text>
        </VStack>
    )
}

function CitaDetails({ cita }) {
    return (
        <HStack w={"100%"} justifyContent={"space-between"}>
            <VStack alignItems={"start"} gap={"0.3rem"}>
                <Heading>Viernes 20</Heading>
                <Text>Junio de 2025</Text>
                <Text mb={"0.5rem"} fontWeight={700} color={"pink.500"}>10:00 a.m.</Text>
                <Badge
                    py={"0.2rem"}
                    fontSize={"0.9rem"}
                    w={"100%"}
                    justifyContent={"center"}
                    fontWeight={700}
                    px={"1rem"}
                    className="light"
                    variant={"surface"}
                    colorPalette={"purple"} >30 mins.</Badge>
            </VStack>
            <Image
                shadow={"sm"}
                borderRadius={"full"}
                src="/img/clientas/avatar-woman.png"
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