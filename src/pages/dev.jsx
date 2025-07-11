"use client";

import { Button, Heading } from "@chakra-ui/react";

export default function Dev() {
    function handleLogOut(){

    }
    
    return (
        <>
            <Heading>Hola Dev</Heading>
            <Button onClick={handleLogOut}>Log Out</Button>
        </>
    );
}
