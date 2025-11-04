// frontend/src/api/events.js
import axios from "axios";

const API_URL = "/api/events"; 

const eventsAPI = {
  // ✅ Active events
  getAll: () => axios.get(API_URL),

  // ✅ Deleted events
  getDeleted: () => axios.get(`${API_URL}/deleted`),

  // ✅ Add event (supports image/video upload)
  add: (formData) =>
    axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // ✅ Soft delete
  softDelete: (id) => axios.patch(`${API_URL}/delete/${id}`),

  // ✅ Restore
  restore: (id) => axios.patch(`${API_URL}/restore/${id}`),

  // ✅ Permanent delete
  permanentDelete: (id) => axios.delete(`${API_URL}/${id}`),
};

export default eventsAPI;
