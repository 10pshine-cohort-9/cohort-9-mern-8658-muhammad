import axios from "axios";

export const API_URL = process.env.BACKEND_URL;

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


