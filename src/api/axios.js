import axios from 'axios'

// Create axios instance with base URL from environment
// For development, use Vite proxy. For production, use CORS proxy
const isDevelopment = import.meta.env.DEV
const baseURL = isDevelopment 
  ? '/api' // Use Vite proxy in development
  : 'https://api.allorigins.win/raw?url=' + encodeURIComponent(import.meta.env.VITE_API_BASE_URL) // Use CORS proxy in production

const api = axios.create({
  baseURL,
  timeout: 15000
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Show SweetAlert2 for API errors
    const errorMessage = error.response?.data?.message || error.message || 'Dogodila se greška'
    
    // Import SweetAlert2 dynamically to avoid circular imports
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        icon: 'error',
        title: 'API Greška!',
        text: errorMessage,
        confirmButtonText: 'U redu',
        position: 'top-end',
        toast: true
      })
    })
    
    return Promise.reject(error)
  }
)

export default api
