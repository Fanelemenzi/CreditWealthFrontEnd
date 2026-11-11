import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authApiClient } from './apiClient.js'
import AuthService from './AuthService.js'

vi.mock('./apiClient.js', () => ({
  authApiClient: {
    post: vi.fn()
  }
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('registers with the Business API, then signs in and stores both tokens', async () => {
    const signupData = {
      phone: '+26878123456',
      username: '+26878123456',
      password: 'SecurePass123!',
      first_name: 'John',
      last_name: 'Doe',
      national_id: '9001010000000',
      date_of_birth: '1990-01-01'
    }
    const tokens = { access: 'access-token', refresh: 'refresh-token' }
    authApiClient.post
      .mockResolvedValueOnce({ status: 201, data: { id: 'uuid' } })
      .mockResolvedValueOnce({ data: tokens })

    await expect(AuthService.signup(signupData)).resolves.toEqual(tokens)

    expect(authApiClient.post).toHaveBeenNthCalledWith(1, '/api/auth/register/', signupData)
    expect(authApiClient.post).toHaveBeenNthCalledWith(2, '/api/auth/token/', {
      phone: '+26878123456',
      password: 'SecurePass123!'
    })
    expect(localStorage.getItem('access_token')).toBe('access-token')
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
  })

  it('signs in with the Business API and stores both tokens', async () => {
    const credentials = { phone: '+26878123456', password: 'SecurePass123!' }
    authApiClient.post.mockResolvedValue({
      data: { access: 'access-token', refresh: 'refresh-token' }
    })

    await AuthService.signin(credentials)

    expect(authApiClient.post).toHaveBeenCalledWith('/api/auth/token/', credentials)
    expect(localStorage.getItem('access_token')).toBe('access-token')
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
  })

  it('does not report success when the response has no token pair', async () => {
    authApiClient.post.mockResolvedValue({ data: { message: 'Unexpected response' } })

    await expect(AuthService.signin({
      phone: '+26878123456',
      password: 'SecurePass123!'
    })).rejects.toThrow('Authentication response did not include access and refresh tokens.')

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })
})
