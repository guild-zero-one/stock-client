import axios from "axios";

// Criar uma instância do axios para requisições internas
const internalApi = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  timeout: 30000,
});

// Interface para tipar o retorno das imagens
interface ImageResult {
  original: string;
  thumbnail: string;
  title: string;
  source: string;
}

export const search = async (query: string) => {
  try {
    const response = await internalApi.get(`/serpapi?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Erro na busca:", error);
    throw error;
  }
};

export const searchMultipleImages = async (
  query: string, 
  limit: number = 9,
  page: number = 0
): Promise<ImageResult[]> => {
  try {
    const response = await internalApi.get(`/serpapi?q=${encodeURIComponent(query)}&ijn=${page}`);
    const data = response.data;
    
    // Verifica se há resultados de imagens
    if (!data.images_results || !Array.isArray(data.images_results)) {
      throw new Error("Nenhuma imagem encontrada");
    }

    // Retorna os primeiros {limit} resultados formatados
    return data.images_results
      .slice(0, limit)
      .map((img: any) => ({
        original: img.original,
        thumbnail: img.thumbnail,
        title: img.title || "",
        source: img.source || ""
      }));
  } catch (error) {
    console.error("Erro na busca de múltiplas imagens:", error);
    throw error;
  }
};