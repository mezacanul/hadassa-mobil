import { Box, Input } from "@chakra-ui/react";

export default function DatePicker_HC({ date, setDate, w = "100%" }) {
    return (
        <Box
            w={w}
            h={"100%"}
            position={"relative"}
        >
            <style>
                {`input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) brightness(0.8); /* Adjust for white or other colors */
                }`}
            </style>
            <Input
                bg={"white"}
                top={0}
                color={"pink.500"}
                borderColor={"pink.500"}
                borderWidth={"2px"}
                zIndex={0}
                value={date}
                onChange={(e) => {
                    console.log(e.target.value);
                    setDate(e.target.value);
                }}
                type="date"
                fontWeight={700}
            />
        </Box>
    );
}
