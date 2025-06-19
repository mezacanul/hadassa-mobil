import { Button, Heading, HStack, Spinner, Text, Textarea, VStack } from "@chakra-ui/react"
import axios from "axios"
import { useState } from "react"

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus id tellus sit amet aliquam. Donec imperdiet eget leo commodo rutrum. Proin felis magna, faucibus sed enim nec, facilisis convallis justo."

export default function Descripcion({ data, clienta }) {
    const [descripcion, setDescripcion] = useState(data ? data : "")
    const [enableUpdate, setEnableUpdate] = useState(false)
    const [updateState, setUpdateState] = useState("iddle")

    function handleUpdate() {
        setUpdateState("loading")
        console.log(descripcion, clienta);

        axios.patch("/api/clientas", { descripcion, clienta })
            .then((updateResp) => {
                const resp = updateResp.data
                if (resp.message == "success" && resp.affectedRows == 1) {
                    console.log(updateResp.data);
                    setUpdateState("success")
                    setEnableUpdate(false)
                }
            })
    }

    return (
        <VStack w={"100%"} alignItems={"start"} gap={"1.5rem"}>
            <Heading>Descripción:</Heading>
            <Textarea onChange={(e) => {
                setEnableUpdate(true)
                setDescripcion(e.target.value)
            }} p={"1rem"} value={descripcion} placeholder="Añade una descripción..." borderColor={"pink.500"} borderWidth={"2px"} fontSize={"1rem"} h={"17rem"} />

            <HStack w={"100%"} justifyContent={"space-between"}>
                {updateState != "loading" && (
                    <Button
                        onClick={handleUpdate}
                        disabled={!enableUpdate}
                        fontWeight={700}
                        className="light"
                        variant={"surface"}
                        shadow={"sm"}
                        colorPalette={"blue"}
                    >
                        Actualizar
                    </Button>
                )}

                {updateState == "success" && <Text color={"green"}>¡Actualizado Exitosamente!</Text>}
                {updateState == "loading" && <Spinner size={"md"} color={"pink.500"} />}
            </HStack>

        </VStack>
    )
}