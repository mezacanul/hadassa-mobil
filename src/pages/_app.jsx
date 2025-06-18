import {
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
import { loadHook, Nexus, Singleton } from "../utils/lattice-design";
import NavBar from "../components/NavBar";
import Head from "next/head";
import MenuPrincipal from "@/components/common/MenuPrincipal";

Nexus({
    useLoader: Singleton(false),
    useMenuOpen: Singleton(false)
})

export default function App({ Component, pageProps }) {
    const [menuOpen, setMenuOpen] = loadHook("useMenuOpen")

    return (
        <ChakraProvider value={defaultSystem}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
                <Head>
                    <title>{"Hadassa Cerón"}</title>
                    <link rel="icon" href="/favicon.png" />
                </Head>

                <Drawer.Root open={menuOpen} onOpenChange={(e) => setMenuOpen(e.open)} size={"full"}>
                    <VStack
                        h={"100vh"}
                        w={"100vw"}
                        overflowX={"hidden"}
                        bg={"white"}
                        color={"black"}
                        px={"2rem"}
                        py={"2rem"}
                    >
                        <NavBar />
                        <Component {...pageProps} />
                    </VStack>

                    <Portal>
                        <MenuPrincipal/>
                    </Portal>
                </Drawer.Root>

            </ThemeProvider>
        </ChakraProvider>
    );
}