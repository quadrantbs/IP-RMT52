import axios from "axios";

const serverApi = axios.create({
  baseURL: "http://localhost:3000",
});

export default serverApi;
