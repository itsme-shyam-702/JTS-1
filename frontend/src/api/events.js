import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API_URL = `${BASE}/api/events`;

const eventsAPI = {
  getAll:          () => axios.get(API_URL),
  getDeleted:      () => axios.get(`${API_URL}/deleted`),
  add:             (formData) => axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  softDelete:      (id) => axios.patch(`${API_URL}/delete/${id}`),
  restore:         (id) => axios.patch(`${API_URL}/restore/${id}`),
  permanentDelete: (id) => axios.delete(`${API_URL}/${id}`),
};

export default eventsAPI;