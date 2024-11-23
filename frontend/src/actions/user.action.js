import axios from 'axios';

const baseApiResponse = (data, isSuccess) => {
  return {
    data: data || null,
    success: isSuccess
  };
};

export const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        username: username,
        password: password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem("username", response.data.username); // Pastikan username ada dalam respons API
      return baseApiResponse(response.data, true);
    } catch (error) {
      console.error("Login failed!:", error);
      return baseApiResponse(error.response ? error.response.data : error.message, false);
    }
  };

  export const signup = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/user/signup', {
        username: username,
        password: password
      });
      return baseApiResponse(response.data, true);
    } catch (error) {
      console.error("Signup failed!:", error);
      return baseApiResponse(error.response ? error.response.data : error.message, false);
    }
  };

  export const logout = () => {
    localStorage.removeItem('token'); // Hapus token dari localStorage
    localStorage.removeItem("username"); 
    return { success: true };
};

// Middleware untuk menambahkan token ke setiap request
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
  