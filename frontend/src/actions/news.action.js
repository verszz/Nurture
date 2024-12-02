import axios from "axios";

const baseApiResponse = (data, isSuccess) => {
  return {
    data: data || null,
    success: isSuccess,
  };
};

// Fungsi untuk mengambil semua berita
export const fetchNews = async () => {
  try {
    const response = await axios.post("http://localhost:3000/news/getAllNews");
    return baseApiResponse(response.data, true); // Formatkan respons menggunakan baseApiResponse
  } catch (error) {
    console.error("Error fetching news:", error);
    return baseApiResponse(
      error.response ? error.response.data : error.message,
      false
    );
  }
};

// Fungsi untuk menambah berita baru
export const addNews = async (news) => {
  try {
    const { title, content, sources, writer, images } = news;
    const response = await axios.post("http://localhost:3000/news/addNews", {
      title,
      content,
      sources,
      writer,
      images,
    });
    return baseApiResponse(response.data, true); // Success
  } catch (error) {
    console.error("Error adding news:", error);
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
