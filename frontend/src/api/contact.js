import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API_URL = `${BASE}/api/contact`;

const api = {
  sendMessage:       (data) => axios.post(API_URL, data),
  getMessages:       ()     => axios.get(API_URL),
  updateRead:        (id)   => axios.put(`${API_URL}/read/${id}`),
  softDeleteMessage: (id)   => axios.put(`${API_URL}/soft-delete/${id}`),
  restoreMessage:    (id)   => axios.put(`${API_URL}/restore/${id}`),
  deleteMessage:     (id)   => axios.delete(`${API_URL}/delete/${id}`),
};

export default api;