import axios from "axios";

// Criar uma instância do axios para requisições internas
const internalApi = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  timeout: 30000,
});

export const search = async (query: string) => {
  try {
    const response = await internalApi.get(`/serpapi?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Erro na busca:", error);
    throw error;
  }
};