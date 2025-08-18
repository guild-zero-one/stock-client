import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000, //10 Segundos
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;