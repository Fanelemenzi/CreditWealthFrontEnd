import apiClient from './apiClient.js'

const storeTokens = (data) => {
  const { access_token: access, refresh_token: refresh } = data || {}

  if (
    typeof access !== 'string' || !access ||
    typeof refresh !== 'string' || !refresh
  ) {
    throw new Error('Authentication response did not include access_token and refresh_token.')
  }

  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
  return data
}

class AuthService {
  async signup(userData) {
    const response = await apiClient.post('/api/auth/signup/', userData)
    return storeTokens(response.data)
  }

  async signin(credentials) {
    const response = await apiClient.post('/api/auth/signin/', credentials)
    return storeTokens(response.data)
  }
}

export default new AuthService()
