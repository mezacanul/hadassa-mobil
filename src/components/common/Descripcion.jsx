import { Button, Heading, Textarea, VStack } from "@chakra-ui/react"

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus id tellus sit amet aliquam. Donec imperdiet eget leo commodo rutrum. Proin felis magna, faucibus sed enim nec, facilisis convallis justo."

export default function Descripcion({ data }) {
    return (
        <VStack w={"100%"} alignItems={"start"} gap={"1.5rem"}>
            <Heading>Descripción:</Heading>
            <Textarea p={"1rem"} value={data} placeholder="Añade una descripción..." borderColor={"pink.500"} borderWidth={"2px"} fontSize={"1rem"} h={"17rem"} />
            <Button fontWeight={700} className="light" variant={"surface"} shadow={"sm"} colorPalette={"blue"}>Actualizar Descripción</Button>
        </VStack>
    )
}