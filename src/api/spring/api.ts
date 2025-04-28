import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9999",
  timeout: 10000, //10 Segundos
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
