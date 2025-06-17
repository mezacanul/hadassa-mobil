import {
    Button,
    ChakraProvider,
    defaultSystem,
    Heading,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { useEffect } from "react";
import { Nexus, Singleton } from "../utils/lattice-design";
import NavBar from "../components/NavBar";

Nexus({
    useLoader: Singleton(false)
})

export default function App({ Component, pageProps }) {
    return (
        <ChakraProvider value={defaultSystem}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
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
            </ThemeProvider>
        </ChakraProvider>
    );
}