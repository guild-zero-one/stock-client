import axios from "axios";
import { Produto } from "@/models/Produto";
import api from "../api";

// Listar Todos produtos
export const todosProdutos = async () => {
  try {
    const response = await api.get<Produto[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    throw error;
  }
}

// Listar produto por ID
export const produtoPorId = async (id: number) => {
  try {
    const response = await api.get<Produto>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produto:", error);
    throw error;
  }
}