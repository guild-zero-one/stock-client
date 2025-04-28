import api from "../api";
import { UsuarioLogin } from "@/models/UsuarioLogin";

const router = "/usuarios";

export const login = async (user: UsuarioLogin) => {
  try {
    const response = await api.post(`${router}/login`, user);
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar o login:", error);
    throw error;
  }
};
