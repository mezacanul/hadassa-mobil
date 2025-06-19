import { Box, Spinner, VStack } from "@chakra-ui/react";

export default function Loader() {
    return (
        <VStack
            position={"absolute"}
            top={0}
            left={0}
            w={"100vw"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            backgroundColor={"white"}
        >
            <Box transform={"scale(1.7)"}>
                <Spinner size={"lg"} color={"pink.500"} />
            </Box>
        </VStack>
    )
}
