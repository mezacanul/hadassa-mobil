import Descripcion from "@/components/common/Descripcion";
import Fotos from "@/components/common/Fotos";
import { Badge, Button, Grid, Heading, HStack, Image, Text, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;
    // const [cita, setCita] = useState(null);
    // const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        // if (citaID) {
        //     axios.get(`/api/citas?id=${citaID}`).then((citaResp) => {
        //         console.log(citaResp.data);
        //         setCita(citaResp.data);
        //         // setLoading(false);
        //     });
        // }
    }, [router.isReady, clientaID]);

    return (
        <VStack w={"100%"} gap={"2rem"}>
            <ClientaAvatar/>
            <Fotos/>
            <Descripcion/>
        </VStack>
    )
}

function ClientaAvatar(){
    return (
        <HStack
            py={"1.5rem"} w={"100%"} justifyContent={"space-between"}>
            <Image
                shadow={"sm"}
                borderRadius={"full"}
                src="/img/clientas/avatar-woman.png"
                w={"7rem"}
            />
            <VStack alignItems={"end"}>
                <Heading w={"90%"} textAlign={"right"}>Naomy Aracelly Alcocer Arceo</Heading>
                <Text>+52 9993524438</Text>
            </VStack>
        </HStack>
    )
}