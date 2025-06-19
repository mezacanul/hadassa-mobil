import { Button } from "@chakra-ui/react";

export default function MainButton({ w, onClick, variant = "outline", disabled, opacity, size = "sm", children }) {
    return (
        <Button 
            // shadow={variant == "solid" && "sm"}
            bgColor={
                variant == "outline" && "initial" || 
                variant == "solid" && "pink.500" ||
                variant == "white" && "transparent" 
                // ? "initial" : "pink.500" 
            }
            opacity={opacity}
            disabled={disabled}
            w={w} 
            onClick={onClick} 
            fontWeight={variant == "white" ? 600 : 800} 
            borderColor={
                variant == "outline" && "pink.500" || 
                variant == "solid" && "pink.500" ||
                variant == "white" && "white" 
            } 
            color={variant == "outline" ? "pink.500" : "white"} 
            borderWidth={variant == "white" ? "1px" : "2px"} 
            size={size}
        >
            {children}
        </Button>
    )
}