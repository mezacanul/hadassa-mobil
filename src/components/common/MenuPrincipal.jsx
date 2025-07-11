import { loadHook } from "@/utils/lattice-design";
import { Button, CloseButton, Drawer, Heading, Link, VStack } from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";
import { useRouter } from "next/router";
import MainButton from "./MainButton";

export default function MenuPrincipal() {
    const NextNav = useNextNav();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = loadHook("useMenuOpen")
    const [usuarioID, setUsuarioID] = loadHook("useUsuarioID")
    const [usuario, setUsuario] = loadHook("useUsuario")
    const [loading, setLoading] = loadHook("useLoader")

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
                                    if(router.pathname != "/"){
                                        NextNav.push(`/`);
                                        setLoading(true)
                                    }
                                    setMenuOpen(false)
                                }}
                                fontWeight={200} color="white">Inicio / Agenda</Link>
                            <Link
                                onClick={() => {
                                    if(router.pathname != `/clientas`){
                                        NextNav.push(`/clientas`);
                                        setLoading(true)
                                    }
                                    setMenuOpen(false)
                                }}
                                fontWeight={200} color="white">Clientas</Link>
                            {/* <Link fontWeight={200} color="white">Perfil</Link> */}
                        </VStack>
                    </Drawer.Body>
                    <Drawer.Footer>
                        <MainButton onClick={()=>{
                            setMenuOpen(false)
                            setLoading(true)
                            
                            setTimeout(() => {
                                NextNav.push(`/`);
                                localStorage.removeItem('hadassa-user');
                                setUsuarioID(null)
                                setUsuario(null)
                            }, 500);
                        }} variant="white">Cerrar Sesión</MainButton>
                    </Drawer.Footer>
                    <Drawer.CloseTrigger asChild>
                        <CloseButton mt={"1rem"} size="2xl" color={"white"} />
                    </Drawer.CloseTrigger>
                </Drawer.Content>
            </Drawer.Positioner>
        </>
    )
}
