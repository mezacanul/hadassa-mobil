import { Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import MainButton from "./common/MainButton";
import { loadHook } from "@/utils/lattice-design";
import { useEffect, useState } from "react";
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { capitalizeFirst } from "@/utils/main";
import { useRouter } from "next/router";

export default function NavBar() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = loadHook("useMenuOpen")

    useEffect(() => {
        console.log("route", router);
    }, [router]);

    return (
        <HStack w={"100%"} justifyContent={"space-between"}>
            {router.pathname == "/" && <FechaTitle />}
            <Heading size={"3xl"} color={"pink.600"}>
                {router.pathname == "/citas/[citaID]" && "Cita"}
                {router.pathname == "/clientas" && "Clientas"}
                {router.pathname == "/clientas/[clientaID]" && "Clienta"}
            </Heading>
            <MainButton onClick={() => { setMenuOpen(true) }}>Menu</MainButton>
        </HStack>
    );
}

function FechaTitle() {
    const [date, setDate] = loadHook("useDate")
    const [dateObj, setDateObj] = useState(null)

    useEffect(() => {
        // console.log("test", date);
        const parsedDate = parse(date, 'yyyy-MM-dd', new Date());

        const obj = {
            dayName: capitalizeFirst(format(parsedDate, "EEEE dd", { locale: es })), // "Jueves 19" 
            monthYearFormat: capitalizeFirst(format(parsedDate, "MMMM 'de' yyyy", { locale: es })) // "Junio de 2025"
        }
        console.log(obj);

        setDateObj(obj)
    }, [date])

    return (
        <VStack alignItems={"start"} gap={1}>
            <Heading size={"3xl"} color={"pink.600"}>{dateObj && dateObj.dayName}</Heading>
            <Text>{dateObj && dateObj.monthYearFormat}</Text>
        </VStack>
    )
}