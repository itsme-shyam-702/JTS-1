import axios from "axios";

// Generic axios instance pointing to the backend base
const api = axios.create({
  baseURL: "/api",
});

export default api;
