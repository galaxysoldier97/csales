import axios from 'axios';

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api/`,   
  headers: {
    'Content-Type': 'application/json'
  }
});

export default authApi;