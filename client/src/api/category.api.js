import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL;

class CategoryApi {
  constructor() {
    this.baseUrl = `${BASE_URL}/api/categories`;
  }

  getAll = async () => {
    try {
      const response = await axios.get(this.baseUrl);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || error.message };
    }
  };

  create = async (formData) => {
    try {
      const response = await axios.post(this.baseUrl, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || error.message };
    }
  };

  update = async (id, formData) => {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || error.message };
    }
  };

  delete = async (id) => {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`, {
        withCredentials: true,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || error.message };
    }
  };
}

export const categoryApi = new CategoryApi();
