import { Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";

export default function NavBar() {
    return (
        <HStack w={"100%"} justifyContent={"space-between"}>
            <FechaTitle />
            <MainButton>Menu</MainButton>
        </HStack>
    );
}

function FechaTitle() {
    return (
        <VStack alignItems={"start"} gap={1}>
            <Heading size={"3xl"} color={"pink.500"}>Martes 17</Heading>
            <Text>Juntio de 2025</Text>
        </VStack>
    )
}

function MainButton({ children }) {
    return (
        <Button fontWeight={"800"} borderColor={"pink.500"} color={"pink.500"} borderWidth={"2px"} size={"sm"}>{children}</Button>
    )
}