import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export const useAdmissionAPI = () => {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL: "https://junior-school-67nt.onrender.com/api/admission",
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    getAdmissions: () => api.get("/"),
    submitAdmission: (data) => api.post("/", data),
    deleteAdmission: (id) => api.delete(`/${id}`),
  };
};
