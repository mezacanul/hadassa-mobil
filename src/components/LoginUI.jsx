import { Image, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import MainButton from "./common/MainButton";
import { useEffect, useState } from "react";
import { loadHook } from "@/utils/lattice-design";
import { useRouter as useNextNav } from "next/navigation";
import axios from "axios";

export default function LoginUI() {
    const [usuarioID, setUsuarioID] = loadHook("useUsuarioID")
    const NextNav = useNextNav();
    const [loginState, setLoginState] = useState("iddle")
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = loadHook("useLoader")

    useEffect(()=>{
        setLoading(false)
    }, [])

    const handleLogin = () => {
        setLoginState("loading")
        axios.post("/api/login", { userID: user, password })
            .then((loginResp) => {
                console.log(loginResp);
                setLoginState("success")
                setTimeout(() => {
                    setUsuarioID(loginResp.data.usuarioID)
                    localStorage.setItem('hadassa-user', loginResp.data.usuarioID);
                    NextNav.push(`/`);
                    setLoading(true)
                }, 1000);
            })
            .catch(error => {
                setLoginState("error")
                console.log(error.response);
            });
    }

    return (
        <VStack gap={"2rem"} w={"100%"} h={"85%"} justifyContent={"center"} alignItems={"center"}>
            <Image src="/hadassa-logo.jpg" w={"70%"} />

            <VStack w={"85%"}>
                <Input value={user} onChange={(e) => {
                    setUser(e.target.value)
                }} borderColor={"pink.500"} borderWidth={"1.5px"} type="text" placeholder="Usuario" />
                <Input onChange={(e) => {
                    setPassword(e.target.value)
                }} value={password} borderColor={"pink.500"} borderWidth={"1.5px"} type="text" placeholder="Contraseña" />
            </VStack>

            {loginState == "loading" && <Spinner size={"lg"} color={"pink.500"} />}
            {
                loginState != "success" &&
                loginState != "loading" &&
                (
                    <MainButton
                        onClick={handleLogin}
                        disabled={
                            user == "" ||
                                password == "" ?
                                true : false
                        }
                        opacity={
                            user == "" ||
                                password == "" ?
                                0.6 : 1
                        }
                        size="md"
                        variant="solid"
                    >
                        Iniciar Sesión
                    </MainButton>
                )
            }

            {loginState == "success" && <Text color={"green"} w={"100%"} textAlign={"center"}>!Bienvenida!</Text>}
            {loginState == "error" && <Text color={"red"} w={"100%"} textAlign={"center"}>Error al iniciar sesión</Text>}
        </VStack>
    )
}