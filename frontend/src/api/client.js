import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  // Render free services can need close to a minute to wake after inactivity.
  timeout: 70000,
  headers: { 'Content-Type': 'application/json' },
})

export const getErrorMessage = (error) =>
  error.response?.data?.detail || error.message || 'Something went wrong. Please try again.'

export default api
