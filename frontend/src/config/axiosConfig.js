import axios from "axios";

// All API calls use this instance instead of hardcoding localhost:4000
// Set VITE_API_URL in your frontend .env file:


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default API;
