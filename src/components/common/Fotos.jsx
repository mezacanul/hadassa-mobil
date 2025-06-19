import { CDN } from "@/config/cdn";
import { loadHook } from "@/utils/lattice-design";
import { Button, CloseButton, Dialog, Grid, Heading, HStack, Image, Portal, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Fotos({ cita, data }) {
    const [open, setOpen] = useState(false)
    const [currentFoto, setCurrentFoto] = useState(null)
    return (
        <Dialog.Root
            size={"full"}
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <VStack w={"100%"} alignItems={"start"} gap={"1.5rem"}>
                <Heading>Fotos:</Heading>
                {data && data.length == 0 && (
                    <Text w={"100%"} textAlign={"center"} color={"black"}>Sin fotos</Text>
                )}

                <Grid gridTemplateColumns={"1fr 1fr 1fr"} gap={"1.5rem"}>
                    {!data && <Spinner size={"lg"} color={"pink.500"} />}
                    {data && data.map((foto, idx) => {
                        return (
                            <Image
                                onClick={() => {
                                    setCurrentFoto(`${CDN}/img/cejas/${foto.foto}`)
                                    setOpen(true)
                                }
                                }
                                key={idx}
                                shadow={"md"}
                                borderRadius={"1rem"}
                                w={"6rem"}
                                h={"6rem"}
                                objectFit={"cover"}
                                src={`${CDN}/img/cejas/${foto.foto}`}
                            />
                        )
                    })}
                </Grid>
            </VStack>
            <ModalFoto currentFoto={currentFoto} />
        </Dialog.Root>
    )
}

function ModalFoto({ currentFoto }) {
    return (
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content className="light">
                    <Dialog.Body>
                        <HStack h={"80vh"} w={"100%"} justifyContent={"center"} alignItems={"center"}>
                            {currentFoto &&
                                <Image
                                    src={currentFoto}
                                    shadow={"lg"}
                                    borderRadius={"1rem"}
                                    w={"80vw"}
                                    h={"80vw"}
                                    objectFit={"cover"}
                                    border={"1px solid gray"}
                                />
                            }
                        </HStack>
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton color={"black"} size="2xl" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    )
}