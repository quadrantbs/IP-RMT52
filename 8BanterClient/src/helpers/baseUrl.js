import axios from "axios";

const serverApi = axios.create({
  baseURL: "https://8banter.okattako.site/",
});

export default serverApi;
