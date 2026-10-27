import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AuthService from '../services/AuthService.js'
import LoginPage from './LoginPage'

vi.mock('../services/AuthService.js', () => ({
  default: {
    signin: vi.fn(),
    signup: vi.fn()
  }
}))

const renderLoginPage = () => render(
  <MemoryRouter initialEntries={['/login']}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<h1>Credit dashboard</h1>} />
    </Routes>
  </MemoryRouter>
)

describe('LoginPage authentication workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('signs in with a phone number and proceeds to the dashboard on success', async () => {
    AuthService.signin.mockResolvedValue({})
    renderLoginPage()

    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+26878123456' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'SecurePass123!' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(AuthService.signin).toHaveBeenCalledWith({
        phone_number: '+26878123456',
        password: 'SecurePass123!'
      })
    })
    expect(await screen.findByRole('heading', { name: 'Credit dashboard' })).toBeInTheDocument()
  })

  it('stays on the login form and displays the API error on failure', async () => {
    AuthService.signin.mockRejectedValue({
      response: { data: { detail: 'Invalid phone number or password.' } }
    })
    renderLoginPage()

    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+26878123456' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong-password' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid phone number or password.')
    expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument()
  })

  it('displays backend signup validation details', async () => {
    AuthService.signup.mockRejectedValue({
      response: {
        data: {
          error: 'Validation failed',
          details: { email: ['Email is required for web registrations.'] }
        }
      }
    })
    renderLoginPage()

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'john@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+26878123456' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'SecurePass123!' }
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'SecurePass123!' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Email is required for web registrations.'
    )
  })

  it('signs up with the documented fields and proceeds to the dashboard', async () => {
    AuthService.signup.mockResolvedValue({})
    renderLoginPage()

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'john@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+26878123456' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'SecurePass123!' }
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'SecurePass123!' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(AuthService.signup).toHaveBeenCalledWith({
        phone_number: '+26878123456',
        password: 'SecurePass123!',
        password_confirm: 'SecurePass123!',
        full_name: 'John Doe',
        email: 'john@example.com',
        registration_channel: 'web',
        preferred_language: 'en'
      })
    })
    expect(await screen.findByRole('heading', { name: 'Credit dashboard' })).toBeInTheDocument()
  })

  it('checks signup password confirmation before making the API request', async () => {
    renderLoginPage()
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'john@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Phone Number'), {
      target: { value: '+26878123456' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'SecurePass123!' }
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'different-password' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Passwords do not match.')
    expect(AuthService.signup).not.toHaveBeenCalled()
  })
})
