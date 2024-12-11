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

export const deleteJournal = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3000/journal/deleteJournal`, {
      data: { id }, // Pass the `id` in the request body
    });
    if (response.status === 200) {
      return true;
    }
    throw new Error("Failed to delete journal.");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const editJournal = async (username, title, Content, new_title) => {
  try {
    const response = await axios.post('http://localhost:3000/journal/EditJournal', {
      username,
      title,
      Content,
      new_title,
    });

    // Return a successful API response
    return baseApiResponse(response.data, true);
  } catch (error) {
    console.error("Error editing journal:", error);

    // Return an error response using the baseApiResponse function
    return baseApiResponse(
      error.response ? error.response.data : error.message,
      false
    );
  }
};