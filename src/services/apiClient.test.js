import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import apiClient, { authApiClient } from './apiClient.js'

const AUTH_URL = 'http://localhost:8000'
const OTHER_URL = 'http://localhost:9000'

// Accepts only the given access token and answers 401 to anything else
const acceptOnly = (validToken) => vi.fn(async (config) => {
  if (config.headers.Authorization === `Bearer ${validToken}`) {
    return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config }
  }
  throw Object.assign(new Error('Unauthorized'), { config, response: { status: 401, config } })
})

describe('shared authentication across both API clients', () => {
  let adapters

  beforeEach(() => {
    localStorage.clear()
    adapters = [apiClient.defaults.adapter, authApiClient.defaults.adapter]
  })

  afterEach(() => {
    apiClient.defaults.adapter = adapters[0]
    authApiClient.defaults.adapter = adapters[1]
    vi.restoreAllMocks()
  })

  it('points each client at its own API', () => {
    expect(authApiClient.defaults.baseURL).toBe(AUTH_URL)
    expect(apiClient.defaults.baseURL).toBe(OTHER_URL)
  })

  it('sends the same access token to both APIs', async () => {
    localStorage.setItem('access_token', 'shared')
    apiClient.defaults.adapter = acceptOnly('shared')
    authApiClient.defaults.adapter = acceptOnly('shared')

    await expect(apiClient.get('/api/score-calculation/latest/')).resolves.toMatchObject({ status: 200 })
    await expect(authApiClient.get('/api/assessments/')).resolves.toMatchObject({ status: 200 })
  })

  it('refreshes once with the Business API when both APIs reject an expired token', async () => {
    localStorage.setItem('access_token', 'expired')
    localStorage.setItem('refresh_token', 'refresh')
    apiClient.defaults.adapter = acceptOnly('fresh')
    authApiClient.defaults.adapter = acceptOnly('fresh')
    const post = vi.spyOn(axios, 'post').mockResolvedValue({ data: { access: 'fresh' } })

    await Promise.all([
      apiClient.get('/api/score-calculation/latest/'),
      authApiClient.get('/api/assessments/')
    ])

    expect(post).toHaveBeenCalledTimes(1)
    expect(post).toHaveBeenCalledWith(`${AUTH_URL}/api/auth/token/refresh/`, { refresh: 'refresh' })
    expect(localStorage.getItem('access_token')).toBe('fresh')
    expect(localStorage.getItem('refresh_token')).toBe('refresh')
  })

  it('stores a rotated refresh token', async () => {
    localStorage.setItem('access_token', 'expired')
    localStorage.setItem('refresh_token', 'refresh')
    apiClient.defaults.adapter = acceptOnly('fresh')
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { access: 'fresh', refresh: 'rotated' } })

    await apiClient.get('/api/score-calculation/latest/')

    expect(localStorage.getItem('refresh_token')).toBe('rotated')
  })

  it('clears the session when the refresh fails', async () => {
    localStorage.setItem('access_token', 'expired')
    localStorage.setItem('refresh_token', 'refresh')
    apiClient.defaults.adapter = acceptOnly('fresh')
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('Refresh rejected'))

    await expect(apiClient.get('/api/score-calculation/latest/')).rejects.toThrow('Refresh rejected')

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })

  it('treats a 401 from login as wrong credentials, not an expired session', async () => {
    localStorage.setItem('access_token', 'stale')
    localStorage.setItem('refresh_token', 'stale-refresh')
    authApiClient.defaults.adapter = acceptOnly('never')
    const post = vi.spyOn(axios, 'post')

    await expect(authApiClient.post('/api/auth/token/', {})).rejects.toMatchObject({
      response: { status: 401 }
    })

    expect(post).not.toHaveBeenCalled()
    expect(localStorage.getItem('access_token')).toBe('stale')
  })

  it('sends no token with login or registration', async () => {
    localStorage.setItem('access_token', 'stale')
    const adapter = vi.fn(async (config) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config }))
    authApiClient.defaults.adapter = adapter

    await authApiClient.post('/api/auth/token/', {})
    await authApiClient.post('/api/auth/register/', {})

    adapter.mock.calls.forEach(([config]) => {
      expect(config.headers.Authorization).toBeUndefined()
    })
  })
})
