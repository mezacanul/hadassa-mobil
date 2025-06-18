import { Badge, Box, Button, createListCollection, Heading, HStack, Image, Input, Portal, Select, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaRegCalendar } from "react-icons/fa";
import MainButton from "../common/MainButton";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es"; // Import Spanish locale

export default function Agenda() {
    return (
        <VStack w={"100%"} gap={"3rem"}>
            <Lashista />
            <AccionesAgenda />
            <Citas />
        </VStack>
    )
}

function Citas() {
    return (
        <VStack w={"100%"} gap={"2rem"}>
            <CitaCard />
            <CitaCard />
            <CitaCard />
        </VStack>
    )
}

function CitaCard() {
    return (
        <VStack className="light" gap={"1rem"} py={"1rem"} px={"1.5rem"} w={"100%"} borderColor={"pink.600"} borderWidth={"2px"} borderRadius={"0.5rem"}>
            <HStack w={"100%"} gap={"1.5rem"}>
                <Image src="/img/clientas/avatar-woman.png" w={"8rem"} />
                <VStack alignItems={"start"}>
                    <Heading fontWeight={800}>Lami Brow</Heading>
                    <Text>10:00 a.m.</Text>
                    <Text>17/06/2025</Text>
                </VStack>
            </HStack>

            <Heading fontWeight={700} color={"pink.600"}>Naomy Aracelly Alcocer Alcocer</Heading>

            <HStack w={"100%"} justifyContent={"space-between"}>
                <Badge px={"1rem"} fontWeight={700} variant={"surface"} colorPalette={"green"}>Confirmada</Badge>
                <Badge px={"1rem"} fontWeight={700} variant={"surface"} colorPalette={"purple"}>30 mins.</Badge>
            </HStack>
        </VStack>
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

function AccionesAgenda() {
    const inputRef = useRef(null);

    useEffect(() => {

    }, [])

    return (
        <VStack w={"100%"} gap={"1rem"}>
            <HStack w={"100%"}>
                <DatePicker_HC />
                <MainButton variant="solid" w={"6rem"}>Hoy</MainButton>
            </HStack>
            <CamasSelect />
        </VStack>
    )
}

const camasColl = createListCollection({
    items: [
        { label: "Ambas Camas", value: "both" },
        { label: "Cama 1", value: "cama-1" },
        { label: "Cama 2", value: "cama-2" },
    ],
})

function CamasSelect() {
    const [value, setValue] = useState("both")

    return (
        <Select.Root
            collection={camasColl}
            width="320px"
            value={value}
            defaultValue={"both"}
            onValueChange={(e) => setValue(e.value)}
            backgroundColor={"white"}
            w={"100%"}
        >
            <Select.HiddenSelect />
            <Select.Control w={"100%"}>
                <Select.Trigger borderColor={"pink.500"} borderWidth={"2px"}>
                    <Select.ValueText placeholder="Ambas Camas" color={"pink.500"} fontWeight={700} textAlign={"center"} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator color={"pink.500"} />
                </Select.IndicatorGroup>
            </Select.Control>

            <Portal>
                <Select.Positioner w={"100%"}>
                    <Select.Content bgColor={"white"} w={"100%"}>
                        {camasColl.items.map((opt, idx) => (
                            <Select.Item item={opt} key={opt.value} color={"pink.600"} _selected={idx == 0 ? true : false} bg={"white"}>
                                {opt.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}

function DatePicker_HC() {
    const inputRef = useRef(null);

    const handleClick = () => {
        const input = inputRef.current;
        if (input) {
            input.showPicker()
        }
    }

    return (
        <Box w={"100%"} h={"100%"} position={"relative"}>
            <style>
                {`input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) brightness(0.8); /* Adjust for white or other colors */
                }`}
            </style>
            <Input
                // position={"absolute"}
                top={0}
                // opacity={0}
                color={"pink.500"}
                borderColor={"pink.500"}
                borderWidth={"2px"}
                zIndex={0}
                // display={"none"}
                ref={inputRef}
                value={"2025-06-10"}
                type="date"
                fontWeight={700}
            />
            {/* <HStack onClick={handleClick} h={"100%"} borderColor={"pink.500"} borderWidth={"2px"} borderRadius={"0.3rem"} w={"100%"} justifyContent={"center"} color={"pink.500"} position={"relative"}>
                <FaRegCalendar />
                <Text fontWeight={700}>17/Junio/2025</Text>
            </HStack> */}
        </Box>
    )
}
