import axios from 'axios'

const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://pokeapi.co/api/v2'

export const api = axios.create({ baseURL, timeout: 10000 })

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error?.response?.status
        const message = error?.response?.data?.message || error.message
        return Promise.reject({ status, message })
    }
)
