import { Grid, Heading, Image, VStack } from "@chakra-ui/react";

export default function Fotos({ cita }) {
    return (
        <VStack w={"100%"} alignItems={"start"} gap={"1.5rem"}>
            <Heading>Fotos:</Heading>
            <Grid gridTemplateColumns={"1fr 1fr 1fr"} gap={"1.5rem"}>
                <Image shadow={"md"} borderRadius={"1rem"} h={"7rem"} objectFit={"cover"} w={"7rem"} src="/img/servicios/srv3.png" />
                <Image shadow={"md"} borderRadius={"1rem"} h={"7rem"} objectFit={"cover"} w={"7rem"} src="/img/servicios/srv3.png" />
                <Image shadow={"md"} borderRadius={"1rem"} h={"7rem"} objectFit={"cover"} w={"7rem"} src="/img/servicios/srv3.png" />
                <Image shadow={"md"} borderRadius={"1rem"} h={"7rem"} objectFit={"cover"} w={"7rem"} src="/img/servicios/srv3.png" />
            </Grid>
        </VStack>
    )
}