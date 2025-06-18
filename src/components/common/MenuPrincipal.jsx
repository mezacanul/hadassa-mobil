import { loadHook } from "@/utils/lattice-design";
import { Button, CloseButton, Drawer, Heading, Link, VStack } from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";

export default function MenuPrincipal() {
    const NextNav = useNextNav();
    const [menuOpen, setMenuOpen] = loadHook("useMenuOpen")

    return (
        <>
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content className="light" p={"1rem"} color={"white"} bgColor={"pink.600"}>
                    <Drawer.Header>
                        <Heading size={"3xl"} color={"white"}>Menu</Heading>
                    </Drawer.Header>
                    <Drawer.Body>
                        <VStack my={"2rem"} fontSize={"2xl"} alignItems={"start"} gap={"2rem"}>
                            <Link
                                onClick={() => {
                                    setMenuOpen(false)
                                    NextNav.push(`/`);
                                }}
                                fontWeight={200} color="white">Agenda</Link>
                            <Link
                                onClick={() => {
                                    setMenuOpen(false)
                                    NextNav.push(`/clientas`);
                                }}
                                fontWeight={200} color="white">Clientas</Link>
                            {/* <Link fontWeight={200} color="white">Perfil</Link> */}
                        </VStack>
                    </Drawer.Body>
                    <Drawer.CloseTrigger asChild>
                        <CloseButton mt={"1rem"} size="2xl" color={"white"} />
                    </Drawer.CloseTrigger>
                </Drawer.Content>
            </Drawer.Positioner>
        </>
    )
}
