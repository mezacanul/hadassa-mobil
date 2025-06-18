import { Heading, HStack, Image, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter as useNextNav } from "next/navigation";

export default function Clientas() {
    const [clientas, setClientas] = useState(null)
    return (
        <VStack w={"100%"} gap={"2rem"}>
            <Input placeholder="Buscar" borderColor={"pink.500"} borderWidth={"2px"} type="text" />
            <ListaClientas clientas={clientas} />
        </VStack>
    )
}

function ListaClientas({ clientas }) {
    return (
        <VStack w={"100%"} gap={"1.5rem"}>
            <ClientaCard />
            <ClientaCard />
            <ClientaCard />
            <ClientaCard />
            <ClientaCard />
            <ClientaCard />
            <ClientaCard />
        </VStack>
    )
}

function ClientaCard() {
    const NextNav = useNextNav();
    return (
        <HStack
            onClick={() => {
                NextNav.push(`/clientas/00382f03-43c5-11f0-a159-d0bf9c8c737e`);
            }}
            py={"1.5rem"} px={"1rem"} borderRadius={"0.5rem"} borderColor={"pink.500"} borderWidth={"2px"} w={"100%"} justifyContent={"space-between"}>
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