import { Heading, HStack, Image, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter as useNextNav } from "next/navigation";
import axios from "axios";
import { loadHook } from "@/utils/lattice-design";

export default function Clientas() {
    const [clientas, setClientas] = useState(null)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        axios.get(`/api/clientas`).then((clientasResp) => {
            // console.log(clientasResp.data)
            setClientas(clientasResp.data)
            setLoading(false)
        })
    }, [])
    return (
        <VStack w={"100%"} gap={"2rem"}>
            <Input value={search} onChange={(e) => { setSearch(e.target.value) }} placeholder="Buscar" borderColor={"pink.500"} borderWidth={"2px"} type="text" />
            {clientas && <ListaClientas clientas={clientas} search={search} />}
        </VStack>
    )
}

function ListaClientas({ clientas, search }) {
    return (
        <VStack w={"100%"} gap={"1.5rem"}>
            {clientas
                .filter((clienta) =>
                    (clienta.nombres + " " + clienta.apellidos)
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
                .map((clienta, idx) => {
                    return <ClientaCard key={idx} data={clienta} />
                })
            }
        </VStack>
    )
}

function ClientaCard({ data }) {
    const NextNav = useNextNav();
    const [loading, setLoading] = loadHook("useLoader");

    return (
        <HStack
            onClick={() => {
                setLoading(true)
                NextNav.push(`/clientas/${data.id}`);
            }}
            py={"1.5rem"} px={"1rem"} borderRadius={"0.5rem"} borderColor={"pink.500"} borderWidth={"2px"} w={"100%"} justifyContent={"space-between"}>
            <Image
                shadow={"sm"}
                borderRadius={"full"}
                src="/img/clientas/avatar-woman.png"
                w={"7rem"}
            />
            <VStack w={"100%"} alignItems={"end"}>
                <Heading w={"90%"} textAlign={"right"}>{`${data.nombres} ${data.apellidos}`}</Heading>
                <Text>{`+${data.lada} ${data.telefono}`}</Text>
            </VStack>
        </HStack>
    )
}