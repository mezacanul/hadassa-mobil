import { Button, CloseButton, Drawer, Heading, Link, VStack } from "@chakra-ui/react";

export default function MenuPrincipal() {
    return (
        <>
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content className="light" p={"1rem"} color={"white"} bgColor={"pink.600"}>
                    <Drawer.Header>
                        <Drawer.Title>
                            <Heading size={"3xl"} color={"white"}>Menu</Heading>
                        </Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                        <VStack my={"2rem"} fontSize={"2xl"} alignItems={"start"} gap={"2rem"}>
                            <Link fontWeight={200} color="white" href="/test">Agenda</Link>
                            <Link fontWeight={200} color="white" href={"/"}>Clientas</Link>
                            <Link fontWeight={200} color="white" href={"/"}>Perfil</Link>
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
