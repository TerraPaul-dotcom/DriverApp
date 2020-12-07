import axios from 'axios'

//const baseURL = '/api'
const baseURL = 'http://localhost:4000/api'

export default axios.create({baseURL});
