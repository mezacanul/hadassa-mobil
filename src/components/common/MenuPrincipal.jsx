import { loadHook } from "@/utils/lattice-design";
import {
    Button,
    CloseButton,
    Drawer,
    Heading,
    Link,
    VStack,
} from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";
import { useRouter } from "next/router";
import MainButton from "./MainButton";

export default function MenuPrincipal() {
    const NextNav = useNextNav();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = loadHook("useMenuOpen");
    const [usuarioID, setUsuarioID] =
        loadHook("useUsuarioID");
    const [usuario, setUsuario] = loadHook("useUsuario");
    const [loading, setLoading] = loadHook("useLoader");

    const menuItems = [
        {
            label: "Inicio / Agenda",
            toPath: "/",
        },
        {
            label: "Clientas",
            toPath: "/clientas",
        },
        {
            label: "Horarios Disponibles",
            toPath: "/compartir",
        },
        {
            label: "Lugares Disponibles",
            toPath: "/live",
        },
    ];

    return (
        <>
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content
                    className="light"
                    p={"1rem"}
                    color={"white"}
                    bgColor={"pink.600"}
                >
                    <Drawer.Header>
                        <Heading
                            size={"3xl"}
                            color={"white"}
                        >
                            Menu
                        </Heading>
                    </Drawer.Header>
                    <Drawer.Body>
                        <VStack
                            my={"2rem"}
                            fontSize={"2xl"}
                            alignItems={"start"}
                            gap={"2rem"}
                        >
                            {menuItems.map((item) => (
                                <MenuItem
                                    key={item.label}
                                    label={item.label}
                                    toPath={item.toPath}
                                    setLoading={setLoading}
                                    setMenuOpen={
                                        setMenuOpen
                                    }
                                />
                            ))}
                        </VStack>
                    </Drawer.Body>
                    <Drawer.Footer>
                        <MainButton
                            onClick={() => {
                                setMenuOpen(false);
                                setLoading(true);

                                setTimeout(() => {
                                    NextNav.push(`/`);
                                    localStorage.removeItem(
                                        "hadassa-user"
                                    );
                                    setUsuarioID(null);
                                    setUsuario(null);
                                }, 500);
                            }}
                            variant="white"
                        >
                            Cerrar Sesión
                        </MainButton>
                    </Drawer.Footer>
                    <Drawer.CloseTrigger asChild>
                        <CloseButton
                            mt={"1rem"}
                            size="2xl"
                            color={"white"}
                        />
                    </Drawer.CloseTrigger>
                </Drawer.Content>
            </Drawer.Positioner>
        </>
    );
}

function MenuItem({
    label,
    toPath,
    setLoading,
    setMenuOpen,
}) {
    const router = useRouter();
    const NextNav = useNextNav();

    return (
        <Link
            onClick={() => {
                if (router.pathname != toPath) {
                    NextNav.push(toPath);
                    setLoading(true);
                }
                setMenuOpen(false);
            }}
            fontWeight={200}
            color="white"
        >
            {label}
        </Link>
    );
}
