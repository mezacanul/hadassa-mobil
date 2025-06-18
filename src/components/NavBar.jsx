import { Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import MainButton from "./common/MainButton";
import { loadHook } from "@/utils/lattice-design";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = loadHook("useMenuOpen")

    return (
        <HStack w={"100%"} justifyContent={"space-between"}>
            <FechaTitle />
            <MainButton onClick={() => { setMenuOpen(true) }}>Menu</MainButton>
        </HStack>
    );
}

function FechaTitle() {
    return (
        <VStack alignItems={"start"} gap={1}>
            <Heading size={"3xl"} color={"pink.600"}>Martes 17</Heading>
            <Text>Juntio de 2025</Text>
        </VStack>
    )
}