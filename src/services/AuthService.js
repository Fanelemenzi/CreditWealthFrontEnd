import {
  logInWithEmail,
  logInWithGoogle,
  logOut,
  resetPassword,
  signUpWithEmail
} from './auth.js'

class AuthService {
  signup(userData) {
    const name = [userData.first_name, userData.last_name].filter(Boolean).join(' ')
    return signUpWithEmail(name, userData.email, userData.password)
  }

  signin(credentials) {
    return logInWithEmail(credentials.email, credentials.password)
  }

  googleSignin() { return logInWithGoogle() }
  resetPassword(email) { return resetPassword(email) }
  signout() { return logOut() }
}

export default new AuthService()
