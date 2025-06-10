import axios from 'axios'

const instance = axios.create({
    // Local Endpoint
    baseURL: 'http://localhost:5000/api/'

    // Deployed Endpoint
    // baseURL: 'https://evangadiforum.backend.abenezerzewge.com/api/'
})
export default instance;