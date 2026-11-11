const messages = {
  'auth/email-already-in-use': 'An account with this email already exists. Try logging in.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  'auth/popup-blocked': 'Your browser blocked the Google sign-in popup. Please allow popups.',
  'auth/account-exists-with-different-credential':
    'This email is already registered with a different sign-in method.'
}

export function getAuthErrorMessage(error) {
  return messages[error?.code] || error?.message || 'Something went wrong. Please try again.'
}
