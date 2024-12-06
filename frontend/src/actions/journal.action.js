import axios from "axios";

const baseApiResponse = (data, isSuccess) => {
  return {
    data: data || null,
    success: isSuccess,
  };
};

export const addJournal = async (username, title, content) => {
  try {
    const response = await axios.post('http://localhost:3000/journal/AddJournal', {
      username: username,
      title: title,
      Content: content,
    });

    return baseApiResponse(response.data, true); // Format response using baseApiResponse
  } catch (error) {
    console.error("Error adding journal:", error);
    return baseApiResponse(
      error.response ? error.response.data : error.message,
      false
    );
  }
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
export const getJournalById = async (id) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/journal/getJournalById`,
      { id } // Pass the ID in the request body
    );
    return baseApiResponse(response.data, true); // Return successful response
  } catch (error) {
    console.error("Error fetching journal by ID:", error);
    return baseApiResponse(
      error.response ? error.response.data : error.message,
      false
    );
  }
};
export const editJournal = async (username, title, content, newTitle) => {
  try {
    const response = await axios.post("http://localhost:3000/journal/EditJournal", {
      username: username,
      title: title, // Current title
      Content: content, // Updated content, should match backend case
      new_title: newTitle, // New title (can be the same as current)
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, data: response.data };
    }
  } catch (error) {
    console.error("Error editing journal:", error);
    return { success: false, data: error.response ? error.response.data : error.message };
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