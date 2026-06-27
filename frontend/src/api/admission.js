import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API_URL = `${BASE}/api/admission`;

const admissionAPI = {
  getAdmissions:   () => axios.get(API_URL),
  submitAdmission: (data) => axios.post(API_URL, data),
  deleteAdmission: (id) => axios.delete(`${API_URL}/${id}`),
};

export const useAdmissionAPI = () => admissionAPI;
export default admissionAPI;