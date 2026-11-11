import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthService from '../services/AuthService.js'
import { getAuthErrorMessage } from '../services/authErrors.js'
import '../styles/LoginPage.css'
import '../styles/NewDesign.css'

const getApiAuthErrorMessage = (error) => {
  const responseData = error.response?.data

  if (typeof responseData?.detail === 'string') return responseData.detail
  if (typeof responseData?.message === 'string') return responseData.message

  const details = responseData?.details
  const validationMessages = details && typeof details === 'object'
    ? Object.values(details).flatMap((value) => (
      Array.isArray(value) ? value : [value]
    )).filter((value) => typeof value === 'string')
    : []

  if (validationMessages.length > 0) return validationMessages[0]
  if (typeof responseData?.error === 'string') return responseData.error

  // DRF validation errors, such as { "national_id": ["..."] }
  const fieldMessages = responseData && typeof responseData === 'object'
    ? Object.values(responseData).flat().filter((value) => typeof value === 'string')
    : []

  if (fieldMessages.length > 0) return fieldMessages[0]

  return error.message || 'Authentication failed. Please check your details and try again.'
}

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setErrorMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const credentials = {
        email: formData.email.trim(),
        password: formData.password
      }

      if (isSignUp) {
        await AuthService.signup({ ...credentials, first_name: formData.firstName.trim(), last_name: formData.lastName.trim() })
        navigate(location.state?.redirectTo || '/dashboard', { replace: true })
      } else {
        await AuthService.signin(credentials)
        navigate(location.state?.redirectTo || '/dashboard', { replace: true })
      }
    } catch (error) {
      setErrorMessage(error.code ? getAuthErrorMessage(error) : getApiAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
      setIsSubmitting(true)
      setErrorMessage('')
      try {
        await AuthService.googleSignin()
        navigate(location.state?.redirectTo || '/dashboard', { replace: true })
      } catch (error) {
        setErrorMessage(getAuthErrorMessage(error))
      } finally {
        setIsSubmitting(false)
      }
    }

  const handleResetPassword = async () => {
      if (!formData.email.trim()) {
        setErrorMessage('Enter your email address first.')
        return
      }
      try {
        await AuthService.resetPassword(formData.email.trim())
        setErrorMessage('If that email is registered, a reset link is on its way.')
      } catch (error) {
        setErrorMessage(getAuthErrorMessage(error))
      }
    }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-branding">
            <div className="logo-large">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="3" />
                <path d="M16 8v8l5 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>CreditScore</span>
            </div>
            <h1>Your Financial Journey Starts Here</h1>
            <p>Join thousands of users who have taken control of their credit health</p>
            <div className="trust-indicators">
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Bank-level Security</span>
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>100% Free Assessment</span>
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <button onClick={() => navigate('/')} className="back-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Home
            </button>

            <div className="form-header">
              <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
              <p>{isSignUp ? 'Sign up to get your credit score' : 'Sign in to view your credit score'}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                  />
                </div>
              )}

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  minLength={isSignUp ? 8 : undefined}
                  required
                />
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="forgot-link" onClick={handleResetPassword}>Forgot password?</button>
                </div>
              )}

              {errorMessage && (
                <p className="auth-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Please wait...'
                  : isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-buttons">
                <button type="button" className="btn-social" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
              </div>

              <div className="toggle-form">
                {isSignUp ? (
                  <p>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setIsSignUp(false)} className="toggle-link">
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setIsSignUp(true)} className="toggle-link">
                      Sign up
                    </button>
                  </p>
                )}
              </div>
            </form>

            {isSignUp && (
              <p className="terms-text">
                By signing up, you agree to our{' '}
                <a href="#terms">Terms of Service</a> and{' '}
                <a href="#privacy">Privacy Policy</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
