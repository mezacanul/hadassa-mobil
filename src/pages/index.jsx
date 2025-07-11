import {
    Box,
    Grid,
    GridItem,
    Heading,
    HStack,
    Image,
    VStack,
} from "@chakra-ui/react";
import Agenda from "../components/agenda";
import { loadHook } from "@/utils/lattice-design";
import { useEffect, useState } from "react";
import axios from "axios";
import { CDN } from "@/config/cdn";
import { FaAddressBook } from "react-icons/fa6";

export default function Home() {
    const [usuario] = loadHook("useUsuario");
    const [usuarioID] = loadHook("useUsuarioID");
    const [currentLashista, setCurrentLashista] =
        useState(null);
    const [loading, setLoading] = loadHook("useLoader");
    const [lashistas, setLashistas] = useState(null);

    useEffect(() => {
        if (usuario && usuario.rol == "lashista") {
            setCurrentLashista(usuarioID);
        } else if (usuario) {
            axios
                .get("/api/lashistas")
                .then((lashistasResp) => {
                    console.log(lashistasResp.data);
                    setLashistas(lashistasResp.data);
                    setLoading(false);
                });
        }
    }, [usuario]);

    // useEffect(() => {
    //     // console.log(usuarioID);
    //     Promise.all([
    //         axios.get(`/api/lashistas?id=${usuarioID}`),
    //         // axios.get(`/api/camas?id=${usuarioID}`),
    //     ])
    //         .then(([lashistaResp]) => {
    //             // console.log(camasResp);
    //             setUsuario(lashistaResp.data[0])
    //             setLoading(false)
    //         })
    // }, [])

    return (
        <VStack
            w={"100%"}
            align={"start"}
        >
            {/* <Heading>{usuario && usuario.rol}</Heading> */}
            {currentLashista && (
                <Agenda
                    lashistaID={currentLashista}
                    setCurrentLashista={setCurrentLashista}
                />
            )}
            {lashistas && !currentLashista && (
                <MenuLashistas
                    lashistas={lashistas}
                    setCurrentLashista={setCurrentLashista}
                />
            )}
        </VStack>
    );
}

function MenuLashistas({ lashistas, setCurrentLashista }) {
    return (
        <VStack
            alignItems={"start"}
            gap={"3rem"}
            w={"100%"}
        >
            <Heading
                textAlign={"center"}
                w={"100%"}
                size={"2xl"}
            >
                Ver Agenda
            </Heading>
            <Grid
                w={"100%"}
                gap={"2rem"}
                gapY={"3rem"}
                gridTemplateColumns={"1fr 1fr"}
            >
                {lashistas.map((lashista, idx) => {
                    return (
                        <GridItem
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            gap={"1rem"}
                            key={idx}
                            onClick={() => {
                                setCurrentLashista(
                                    lashista.id
                                );
                            }}
                        >
                            <Image
                                shadow={"sm"}
                                w={"8rem"}
                                rounded={"full"}
                                src={`${CDN}/img/lashistas/${lashista.image}`}
                            />
                            <HStack>
                                <Heading
                                    size={"lg"}
                                    color={"pink.600"}
                                >
                                    <FaAddressBook />
                                </Heading>
                                <Heading color={"pink.600"}>
                                    {lashista.nombre}
                                </Heading>
                            </HStack>
                        </GridItem>
                    );
                })}
            </Grid>
        </VStack>
    );
}
