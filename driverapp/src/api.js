import axios from 'axios'

//const baseURL = '/api'
const baseURL = 'http://localhost:3000/api'

export default axios.create({baseURL});
