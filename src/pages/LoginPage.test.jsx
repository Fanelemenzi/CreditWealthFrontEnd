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

const fillSignupForm = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
  const values = {
    'First Name': 'John',
    'Last Name': 'Doe',
    'National ID Number': '9001010000000',
    'Date of Birth': '1990-01-01',
    'Phone Number': '+26878123456',
    Password: 'SecurePass123!',
    'Confirm Password': 'SecurePass123!'
  }
  Object.entries(values).forEach(([label, value]) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  })
}

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
        phone: '+26878123456',
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
        data: { national_id: ['A user with this national ID already exists.'] }
      }
    })
    renderLoginPage()

    fillSignupForm()
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'A user with this national ID already exists.'
    )
  })

  it('signs up with the Business API fields and proceeds to the dashboard', async () => {
    AuthService.signup.mockResolvedValue({})
    renderLoginPage()

    fillSignupForm()
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(AuthService.signup).toHaveBeenCalledWith({
        phone: '+26878123456',
        username: '+26878123456',
        password: 'SecurePass123!',
        first_name: 'John',
        last_name: 'Doe',
        national_id: '9001010000000',
        date_of_birth: '1990-01-01'
      })
    })
    expect(await screen.findByRole('heading', { name: 'Credit dashboard' })).toBeInTheDocument()
  })

  it('checks signup password confirmation before making the API request', async () => {
    renderLoginPage()

    fillSignupForm()
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'different-password' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Passwords do not match.')
    expect(AuthService.signup).not.toHaveBeenCalled()
  })
})
