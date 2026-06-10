import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL;

class UserApi {
  constructor() {
    this.baseUrl = `${BASE_URL}/api/auth`;
  }

  loginUser = async (credentials) => {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, credentials, {
        withCredentials: true,
      });
      return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  logoutUser = async () => {
    try {
      const response = await axios.post(`${this.baseUrl}/logout`, {}, {
        withCredentials: true,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  authMe = async () => {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        withCredentials: true,
      });
      return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };
}

export const userApi = new UserApi();