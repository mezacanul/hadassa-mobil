import Descripcion from "@/components/common/Descripcion";
import Fotos from "@/components/common/Fotos";
import { CDN } from "@/config/cdn";
import { loadHook } from "@/utils/lattice-design";
import { Badge, Button, Grid, Heading, HStack, Image, Text, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;
    const [clienta, setClienta] = useState(null);
    const [fotos, setFotos] = useState(null)
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        if(clientaID){
            console.log(clientaID);
            Promise.all([
                axios.get(`/api/clientas?id=${clientaID}`),    
                axios.get(`/api/fotos_cejas?id=${clientaID}`)
            ]).then(([clientaResp, fotosResp])=>{
                console.log(clientaResp.data[0])
                console.log(fotosResp.data)
                setClienta(clientaResp.data[0])
                setFotos(fotosResp.data)
                setLoading(false)
            })
        }
    }, [router.isReady]);

    return (
        <VStack w={"100%"} gap={"2rem"}>
            {clienta && <ClientaAvatar data={clienta} />}
            <Fotos data={fotos}/>
            {clienta && <Descripcion data={clienta.detalles_cejas} clienta={clienta.id}/>}
        </VStack>
    )
}

function ClientaAvatar({ data }) {
    return (
        <HStack
            py={"1.5rem"} w={"100%"} justifyContent={"space-between"}>
            <Image
                shadow={"sm"}
                borderRadius={"lg"}
                src={`${CDN}/img/clientas/${data.foto_clienta ? data.foto_clienta : "avatar-woman.png"}`}
                w={"7rem"}
            />
            <VStack w={"100%"} alignItems={"end"}>
                <Heading w={"90%"} textAlign={"right"}>
                    {`${data.nombres} ${data.apellidos}`}
                </Heading>
                <Text>{`+${data.lada} ${data.telefono}`}</Text>
            </VStack>
        </HStack>
    )
}