import { Button } from "@chakra-ui/react";

export default function MainButton({ w, onClick, variant = "outline", children }) {
    return (
        <Button bgColor={variant == "outline" ? "initial" : "pink.500" } w={w} onClick={onClick} fontWeight={"800"} borderColor={"pink.500"} color={variant == "outline" ? "pink.500" : "white"} borderWidth={"2px"} size={"sm"}>{children}</Button>
    )
}