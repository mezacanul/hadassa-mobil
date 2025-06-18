import {
    VStack,
} from "@chakra-ui/react"
import Image from "next/image"
import Agenda from "../components/agenda"

export default function Page() {
    return (
        <VStack w={"100%"} align={"start"} >
            <Agenda />
        </VStack>
    )
}
