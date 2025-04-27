import api from "../api";
import { UsuarioLogin } from "@/models/UsuarioLogin";

export const login = async (user: UsuarioLogin) => {
  console.log("Login", user);
  try {
    const response = await api.post("/usuarios/login", user);
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar o login:", error);
    throw error;
  }
};
