import axios from "axios";

export const instance = axios.create({
  // baseURL: "https://k-editor-service.onrender.com/api",
  baseURL: "http://localhost:8080/api",
  // timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
});
