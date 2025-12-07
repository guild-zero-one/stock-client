import axios from "axios";

const apiGemini = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GEMINI_API_URL,
  withCredentials: true,
  timeout: 300000, //30 Segundos
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiGemini;
