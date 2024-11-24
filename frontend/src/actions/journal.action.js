import axios from "axios";

const baseApiResponse = (data, isSuccess) => {
  return {
    data: data || null,
    success: isSuccess,
  };
};

// Fungsi untuk mengambil semua jurnal
export const getAllJournal = async (username) => {
  try {
    const response = await axios.post('http://localhost:3000/journal/getAllJournal', {
        username: username
    });
    return baseApiResponse(response.data, true); // Formatkan respons menggunakan baseApiResponse
  } catch (error) {
    console.error("Error fetching journal:", error);
    return baseApiResponse(
      error.response ? error.response.data : error.message,
      false
    );
  }
};

// Middleware untuk menambahkan token ke setiap request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
