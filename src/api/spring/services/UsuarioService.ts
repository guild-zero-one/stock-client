import api from "../api";
import { UsuarioLogin } from "@/models/Usuario/UsuarioLogin";

const router = "/usuarios";

export const login = async (user: UsuarioLogin) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(`${router}/login`, user, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar o login:", error);
    throw error;
  }
};

export const usuarioAutenticado = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`${router}/autenticado`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Usuario encontrado: ", response.data)
    return response.data;
  } catch (error) {
    console.error("Deu ruim: ", error);
    throw error;
  }
}

export const usuarioPorId = async (id: number) => {
  try {
    const response = await api.get(`${router}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao procurar usuário: ", error);
    throw error;
  }
}
export const listarUsuarios = async () => {
  try {
    const response = await api.get(`${router}`);
    return response.data;
  } catch (error) {
    console.error("Deu ruim: ", error);
    throw error;
  }
}
