import axios from "axios";

// Generic axios instance pointing to the backend base
const api = axios.create({
  baseURL:  process.env.REACT_APP_BACKEND_URL +"/api",
});

export default api;
