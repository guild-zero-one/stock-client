import axios from 'axios';
import { Categoria } from '@/models/Categoria';
import api from '../api';

// Listar todas as categorias
export const todasCategorias = async () => {
  try {
    const response = await api.get<Categoria[]>('/categories');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    throw error;
  }
}

// Listar categoria por ID
export const categoriaPorId = async (categoriaId: number) => {
  try {
    const response = await api.get<Categoria>(`/categories/${categoriaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar categoria:', error);
    throw error;
  }
}

// Listar produtos por categoria
export const produtosPorCategoria = async (categoriaId: number) => {
  try {
    const response = await api.get<Categoria>(`/categories/${categoriaId}`);
    return response.data.products;
  } catch (error) {
    console.error('Erro ao listar produtos por categoria:', error);
    throw error;
  }
}
