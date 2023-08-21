import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.100.200:8080'
});

export default api;