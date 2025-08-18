import { Usuario } from "@/models/Usuario/Usuario";
import api from "../api";
import { UsuarioLogin } from "@/models/Usuario/UsuarioLogin";

const router = "/usuarios";

export const login = async (user: UsuarioLogin) => {
  try {
    const response = await api.post(`${router}/login`, user);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao realizar o login:", error.response || error);
    console.log("URL chamada:", `${router}/login`);
    throw error;
  }
};


export const usuarioAutenticado = async () => {
  try {
    const response = await api.get(`${router}/autenticado`);
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

export const loggout = async () => {
  try {
    const response = await api.post(`${router}/logout`);
    return response;
  }
  catch (error) {
    console.error("Erro ao encerrar sessão: ", error);
    throw error
  }
}


