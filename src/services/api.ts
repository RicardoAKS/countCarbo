import axios from "axios";

const api = axios.create({
    baseURL: 'https://countcarbo.online'
});

export default api;