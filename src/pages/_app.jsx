import {
    Box,
    Button,
    ChakraProvider,
    defaultSystem,
    Drawer,
    Heading,
    HStack,
    Portal,
    VStack,
} from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { useEffect } from "react";
import {
    loadHook,
    Nexus,
    Singleton,
} from "../utils/lattice-design";
import NavBar from "../components/NavBar";
import Head from "next/head";
import MenuPrincipal from "@/components/common/MenuPrincipal";
import { format } from "date-fns";
import LoginUI from "@/components/LoginUI";
import Loader from "@/components/common/Loader";
import axios from "axios";

Nexus({
    // useUsuarioID: Singleton("d3e7b9a2-feed-11ef-8036-acde48001122"),
    // useUsuarioID: Singleton("d3e7bb64-feed-11ef-8036-acde48001122"),
    useUsuarioID: Singleton(null),
    useUsuario: Singleton(null),
    useMenuOpen: Singleton(false),
    useLoader: Singleton(true),
    useDate: Singleton(format(new Date(), "yyyy-MM-dd")),
});

export default function App({ Component, pageProps }) {
    const [menuOpen, setMenuOpen] = loadHook("useMenuOpen");
    const [usuarioID, setUsuarioID] =
        loadHook("useUsuarioID");
    const [usuario, setUsuario] = loadHook("useUsuario");
    const [loading] = loadHook("useLoader");

    useEffect(() => {
        const currentUser =
            localStorage.getItem("hadassa-user");
        if (currentUser) {
            setUsuarioID(currentUser);

            axios
                .get(`/api/lashistas?id=${currentUser}`)
                .then((lashistaResp) => {
                    console.log(lashistaResp.data[0]);
                    setUsuario(lashistaResp.data[0]);
                });
        }
    }, []);

    return (
        <ChakraProvider value={defaultSystem}>
            <ThemeProvider
                attribute="class"
                disableTransitionOnChange
            >
                <Head>
                    <title>{"Hadassa Cerón"}</title>
                    <link
                        rel="icon"
                        href="/favicon.png"
                    />
                </Head>

                <Drawer.Root
                    open={menuOpen}
                    onOpenChange={(e) =>
                        setMenuOpen(e.open)
                    }
                    size={"full"}
                >
                    <Box
                        h={"100vh"}
                        w={"100vw"}
                        bg={usuarioID ? "#f1f5ff" : "white"}
                        position={"relative"}
                    >
                        <VStack
                            h={"100vh"}
                            w={"100vw"}
                            overflowX={"hidden"}
                            color={"black"}
                            px={"2rem"}
                            py={"2rem"}
                        >
                            {usuarioID ? (
                                <>
                                    <NavBar />
                                    <Box
                                        my={"1.5rem"}
                                        w={"100%"}
                                    >
                                        <Component
                                            {...pageProps}
                                        />
                                    </Box>
                                </>
                            ) : (
                                <LoginUI />
                            )}
                        </VStack>

                        {loading && <Loader />}
                        <Portal>
                            <MenuPrincipal />
                        </Portal>
                    </Box>
                </Drawer.Root>
            </ThemeProvider>
        </ChakraProvider>
    );
}
