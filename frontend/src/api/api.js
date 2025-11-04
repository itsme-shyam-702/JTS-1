import axios from "axios";

// ✅ Create base axios instance
const api = axios.create({
  baseURL: "https://junior-school-67nt.onrender.com/api", // your backend URL
});

// ✅ Function to add a token manually (works with Clerk or any JWT)
export const setAuthToken = async (getToken) => {
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken?.();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn("No Clerk token found:", err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default api;
