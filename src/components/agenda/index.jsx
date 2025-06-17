import { Box, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";

export default function Agenda() {
    return (
        <Box w={"100%"}>
            <Lashista />
        </Box>
    )
}

function Lashista() {
    return (
        <HStack w={"100%"} gap={"1.5rem"}>
            <Image src={"/img/lashistas/hadassa.jpg"} w={"7rem"} />
            <VStack alignItems={"start"}>
                <Heading size={"2xl"}>Hadassa</Heading>
                <Text>09:00 - 13:00</Text>
                <Text>15:30 - 18:00</Text>
            </VStack>
        </HStack>
    )
}