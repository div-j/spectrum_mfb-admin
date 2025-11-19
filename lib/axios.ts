// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://gateway.spectrumpay.com.ng:4010/",
  headers: {
    "Content-Type": "application/json",
    "access-control-allow-origin": "*"
  },
});

export default api;
