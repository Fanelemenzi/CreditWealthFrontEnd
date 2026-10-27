import { beforeEach, describe, expect, it, vi } from 'vitest'
import apiClient from './apiClient.js'
import AuthService from './AuthService.js'

vi.mock('./apiClient.js', () => ({
  default: {
    post: vi.fn()
  }
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('signs up using the documented endpoint and stores both tokens', async () => {
    const signupData = {
      phone_number: '+26878123456',
      password: 'SecurePass123!',
      password_confirm: 'SecurePass123!',
      full_name: 'John Doe',
      email: 'john@example.com',
      registration_channel: 'web',
      preferred_language: 'en'
    }
    const responseData = {
      access_token: 'access-token',
      refresh_token: 'refresh-token'
    }
    apiClient.post.mockResolvedValue({ data: responseData })

    await expect(AuthService.signup(signupData)).resolves.toEqual(responseData)

    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/signup/', signupData)
    expect(localStorage.getItem('access_token')).toBe('access-token')
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
  })

  it('signs in using the documented endpoint and stores both tokens', async () => {
    const credentials = { phone_number: '+26878123456', password: 'SecurePass123!' }
    apiClient.post.mockResolvedValue({
      data: { access_token: 'access-token', refresh_token: 'refresh-token' }
    })

    await AuthService.signin(credentials)

    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/signin/', credentials)
    expect(localStorage.getItem('access_token')).toBe('access-token')
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
  })

  it('does not report success when the response has no token pair', async () => {
    apiClient.post.mockResolvedValue({ data: { message: 'Unexpected response' } })

    await expect(AuthService.signin({
      phone_number: '+26878123456',
      password: 'SecurePass123!'
    })).rejects.toThrow('Authentication response did not include access_token and refresh_token.')

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })
})
