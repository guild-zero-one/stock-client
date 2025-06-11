import axios from "axios";

const apiGemini = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000, //30 Segundos
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiGemini;
