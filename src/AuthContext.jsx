import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import { getMe } from './services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      setProfile(null)

      if (!user) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setLoading(false)
        return
      }

      try {
        localStorage.setItem('access_token', await user.getIdToken())
        if (user.emailVerified) {
          setProfile(await getMe())
        }
      } catch (error) {
        console.error('Could not load authenticated user profile:', error)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, setProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
