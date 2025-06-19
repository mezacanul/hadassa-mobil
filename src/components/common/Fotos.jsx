import { CDN } from "@/config/cdn";
import { loadHook } from "@/utils/lattice-design";
import { Grid, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Fotos({ cita, data }) {
    // useEffect(() => {
    //     axios.get(`/api/fotos_cejas?id=${cita.clienta_id}`).then((fotosResp) => {
    //         console.log(fotosResp.data);
    //         setFotos(fotosResp.data);
    //     })
    // }, [])

    return (
        <VStack w={"100%"} alignItems={"start"} gap={"1.5rem"}>
            <Heading>Fotos:</Heading>
            {data && data.length == 0 && (
                <Text w={"100%"} textAlign={"center"} color={"black"}>No hay fotos para esta clienta.</Text>
            )}

            <Grid gridTemplateColumns={"1fr 1fr 1fr"} gap={"1.5rem"}>
                {data && data.map((foto, idx) => {
                    return (
                        <Image
                            key={idx}
                            shadow={"md"}
                            borderRadius={"1rem"}
                            h={"7rem"}
                            objectFit={"cover"}
                            w={"7rem"}
                            src={`${CDN}/img/cejas/${foto.foto}`}
                        />
                    )
                })}
            </Grid>
        </VStack>
    )
}