import axios from "axios";



export function clearAuthHeader() {
    axios.defaults.headers.common['Authorization'] = '';
    delete axios.defaults.headers.common['Authorization'];
}



export async function setAuthHeader(token: string) {
    clearAuthHeader();
    if (token) { axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; }

}