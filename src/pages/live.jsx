import { loadHook } from "@/utils/lattice-design";
import {
    VStack,
    Box,
    Text,
    HStack,
    Button,
    Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import API from "@/services/main";
import { mapLiveFeed } from "@/utils/main";
import { MdOutlineChair } from "react-icons/md";
import { LuBed } from "react-icons/lu";
import { IoReload } from "react-icons/io5";

export default function Live() {
    const [loading, setLoading] = loadHook("useLoader");
    const [liveFeed, setLiveFeed] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchLiveFeed().then(() => {
            setLoading(false);
        });
    }, []);

    const fetchLiveFeed = async () => {
        setIsUpdating(true);
        const res = await API.live.getAll();
        const mapped = mapLiveFeed(res.data);
        console.log("mapped", mapped);
        setLiveFeed(mapped);
        setIsUpdating(false);
    };

    function handleUpdate(data) {
        setIsUpdating(true);
        const payload = {
            id: data.id,
            status: data.active ? 0 : 1,
        };
        API.live
            .update(payload)
            .then((res) => {
                const mapped = mapLiveFeed(res.data);
                console.log(mapped);
                setLiveFeed(mapped);
                setIsUpdating(false);
            })
            .catch(() => {
                setIsUpdating(false);
            });
    }

    return (
        <Box
            w={"100%"}
            h={"100%"}
            py={"3rem"}
        >
            <VStack
                w={"100%"}
                gap={"2rem"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                {liveFeed && (
                    <FeedContainer isUpdating={isUpdating}>
                        {liveFeed.sillas.map((silla) => (
                            <FeedItem
                                key={silla.id}
                                type="silla"
                                data={silla}
                                handleUpdate={handleUpdate}
                            />
                        ))}
                    </FeedContainer>
                )}

                {liveFeed && (
                    <FeedContainer isUpdating={isUpdating}>
                        {liveFeed.camas.map((cama) => (
                            <FeedItem
                                key={cama.id}
                                type="cama"
                                data={cama}
                                handleUpdate={handleUpdate}
                            />
                        ))}
                    </FeedContainer>
                )}
            </VStack>

            <Text
                textAlign={"center"}
                w={"80%"}
                mx={"auto"}
                mt={"2rem"}
            >
                {
                    "Aquí puedes actualizar el estado de los lugares disponibles en el estudio"
                }
            </Text>

            <HStack
                w={"100%"}
                justifyContent={"center"}
                mt={"2rem"}
            >
                <Button
                    disabled={isUpdating}
                    // variant=""
                    colorPalette="pink"
                    onClick={fetchLiveFeed}
                    size={"sm"}
                >
                    <IoReload />
                </Button>
            </HStack>
        </Box>
    );
}

function FeedContainer({ children, isUpdating }) {
    return (
        <HStack
            w={"100%"}
            h={"100%"}
            bg={"white"}
            borderRadius={"10px"}
            px={"10px"}
            py={"20px"}
            shadow={"md"}
            gap={"10px"}
            justifyContent={"space-around"}
            alignItems={"center"}
            position={"relative"}
        >
            {isUpdating && <OverlayUpdating />}
            {children}
        </HStack>
    );
}

function FeedItem({ data, handleUpdate }) {
    console.log(data);
    return (
        <Text
            color={data.active ? "pink.500" : "green.500"}
            style={{
                // ...styles.btn,
                fontSize:
                    data.tipo == "silla"
                        ? "3rem"
                        : "3.5rem",
            }}
            _hover={{
                transform: "scale(1.1)",
            }}
            onClick={() => handleUpdate(data)}
        >
            {data.tipo == "silla" ? (
                <MdOutlineChair />
            ) : (
                <LuBed />
            )}
        </Text>
    );
}

function OverlayUpdating() {
    return (
        <HStack
            position={"absolute"}
            top={0}
            left={0}
            w={"100%"}
            h={"100%"}
            bg={"rgba(255, 255, 255, 0.6)"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={"10px"}
            zIndex={1000}
        >
            <Spinner
                size={"md"}
                color={"blue.500"}
                borderWidth={"4px"}
            />
        </HStack>
    );
}
