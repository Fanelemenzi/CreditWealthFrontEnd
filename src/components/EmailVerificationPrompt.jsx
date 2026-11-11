import { useEffect, useMemo, useState } from 'react'
import { refreshEmailVerification, resendVerificationEmail } from '../services/auth.js'
import { getAuthErrorMessage } from '../services/authErrors.js'

const RESEND_COOLDOWN_SECONDS = 60
const COOLDOWN_STORAGE_KEY = 'email_verification_resend_until'

const getCooldownKey = (email) => `${COOLDOWN_STORAGE_KEY}:${email || 'current'}`

const getRemainingSeconds = (email) => {
  const until = Number(localStorage.getItem(getCooldownKey(email)) || 0)
  return Math.max(0, Math.ceil((until - Date.now()) / 1000))
}

const EmailVerificationPrompt = ({ email, onVerified }) => {
  const cooldownKey = useMemo(() => getCooldownKey(email), [email])
  const [remainingSeconds, setRemainingSeconds] = useState(() => getRemainingSeconds(email))
  const [message, setMessage] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const remaining = getRemainingSeconds(email)
      setRemainingSeconds(remaining)
      if (remaining === 0) window.clearInterval(intervalId)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [email])

  const handleResend = async () => {
    if (remainingSeconds > 0) return

    setMessage('')
    try {
      await resendVerificationEmail()
      localStorage.setItem(
        cooldownKey,
        String(Date.now() + RESEND_COOLDOWN_SECONDS * 1000)
      )
      setRemainingSeconds(RESEND_COOLDOWN_SECONDS)
      setMessage('Verification email sent. Check your inbox.')
    } catch (error) {
      setMessage(getAuthErrorMessage(error))
    }
  }

  const handleCheckVerification = async () => {
    setIsChecking(true)
    setMessage('')
    try {
      if (await refreshEmailVerification()) {
        onVerified()
      } else {
        setMessage('Your email is not verified yet. Please use the link we sent you.')
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error))
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <aside className="verification-prompt" role="status">
      <div>
        <strong>Verify your email address</strong>
        <p>
          We sent a verification link to <b>{email}</b>. You can continue using
          the dashboard, but verification helps protect your account.
        </p>
        {message && <p className="verification-message">{message}</p>}
      </div>
      <div className="verification-actions">
        <button
          type="button"
          className="cw-btn cw-btn-primary"
          onClick={handleCheckVerification}
          disabled={isChecking}
        >
          {isChecking ? 'Checking...' : "I've verified my email"}
        </button>
        <button
          type="button"
          className="cw-btn cw-btn-ghost"
          onClick={handleResend}
          disabled={remainingSeconds > 0}
        >
          {remainingSeconds > 0
            ? `Resend available in ${remainingSeconds}s`
            : 'Resend verification email'}
        </button>
      </div>
    </aside>
  )
}

export default EmailVerificationPrompt
