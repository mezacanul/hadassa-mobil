import {
    createListCollection,
    HStack,
    Portal,
    Select,
    Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SelectLashista({
    w = "100%",
    lashista,
    setLashista,
}) {
    const [lashistas, setLashistas] = useState(null);

    useEffect(() => {
        const items = [];

        axios
            .get(`/api/lashistas`)
            .then((lashistasResp) => {
                console.log(lashistasResp.data);
                lashistasResp.data.forEach((lashista) => {
                    items.push({
                        label: lashista.nombre,
                        value: lashista.id,
                    });
                });
                const lashistasCollection =
                    createListCollection({
                        items,
                    });
                setLashistas(lashistasCollection);
                // setLashista([lashistasCollection.items[1].value]);
            });
    }, []);
    return (
        <>
            {!lashistas && (
                <HStack
                    w={"100%"}
                    justifyContent={"center"}
                >
                    <Spinner color={"pink.500"} />
                </HStack>
            )}
            {lashistas && (
                <Select.Root
                    collection={lashistas}
                    w={w}
                    value={lashista}
                    onValueChange={(e) => {
                        // console.log(lashista);
                        setLashista(e.value);
                    }}
                    backgroundColor={"white"}
                >
                    <Select.HiddenSelect />
                    <Select.Control w={"100%"}>
                        <Select.Trigger
                            borderColor={"pink.500"}
                            borderWidth={"2px"}
                        >
                            <Select.ValueText
                                placeholder="Seleccionar Lashista"
                                color={"pink.500"}
                                fontWeight={700}
                                textAlign={"center"}
                            />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator
                                color={"pink.500"}
                            />
                        </Select.IndicatorGroup>
                    </Select.Control>

                    <Portal>
                        <Select.Positioner w={"100%"}>
                            <Select.Content
                                backgroundColor={"white"}
                                w={"100%"}
                            >
                                {lashistas.items.map(
                                    (opt, idx) => (
                                        <Select.Item
                                            item={opt}
                                            key={opt.value}
                                            color={
                                                "pink.600"
                                            }
                                            // _selected={
                                            //     idx == 0
                                            //         ? true
                                            //         : false
                                            // }
                                            bg={"white"}
                                        >
                                            {opt.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    )
                                )}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            )}
        </>
    );
}
