import axios from "axios";

const apiGemini = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PDF_API_URL,
  timeout: 30000, //30 Segundos
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiGemini;
