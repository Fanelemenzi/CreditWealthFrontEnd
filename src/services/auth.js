import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth'
import { auth } from '../firebase.js'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
const VERIFICATION_COOLDOWN_SECONDS = 60
const VERIFICATION_COOLDOWN_KEY = 'email_verification_resend_until'

const setVerificationCooldown = (email) => {
  localStorage.setItem(
    `${VERIFICATION_COOLDOWN_KEY}:${email}`,
    String(Date.now() + VERIFICATION_COOLDOWN_SECONDS * 1000)
  )
}

export async function signUpWithEmail(name, email, password) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)

  if (name) {
    await updateProfile(user, { displayName: name })
    await user.getIdToken(true)
  }

  await sendEmailVerification(user)
  setVerificationCooldown(user.email)
  return user
}

export async function logInWithEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

export async function logInWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider)
  return user
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
}

export function resendVerificationEmail() {
  return auth.currentUser ? sendEmailVerification(auth.currentUser) : Promise.resolve()
}

export async function refreshEmailVerification() {
  const user = auth.currentUser
  if (!user) return false

  await user.reload()
  await user.getIdToken(true)
  return user.emailVerified
}

export function logOut() {
  return signOut(auth)
}
