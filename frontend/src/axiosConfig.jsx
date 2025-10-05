import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // backend base
});

export default instance;
