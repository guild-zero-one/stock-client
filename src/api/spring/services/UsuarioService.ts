import { Usuario } from "@/models/Usuario/Usuario";
import api from "../api";
import { UsuarioLogin } from "@/models/Usuario/UsuarioLogin";

const router = "/usuarios";

export const login = async (user: UsuarioLogin) => {
  try {
    const response = await api.post(`${router}/login`, user)
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

export const editarUsuario = async (id: number, usuarioEditado: Usuario) => {
  try {
    const response = await api.patch(`${router}/${id}`, usuarioEditado);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao editar usuário:", error);
    throw error
  }
}
