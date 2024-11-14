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
      return baseApiResponse(response.data, true);
    } catch (error) {
      console.error("Login failed!:", error);
      return baseApiResponse(error.response ? error.response.data : error.message, false);
    }
  };
  