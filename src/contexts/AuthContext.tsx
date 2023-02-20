import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { User } from '@firebase/auth-types'
import auth from '../config/firebase'
import { onUserProfileUpdate } from '../services/EventObservers'
import { UserInfo } from '../types/User'

export type AuthContextType = {
  currentUser: User
  currentUserInfo: UserInfo
  error: string
  profileUpdated: boolean
  setError: (value: string) => void
  login: (email: string, password: string) => void
  register: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>({} as User)
  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo>({} as UserInfo)
  const [profileUpdated, setProfileUpdated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  async function register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    signOut(auth)
    setProfileUpdated(false)
    setCurrentUserInfo({} as UserInfo)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user as User)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (currentUser?.uid) {
      const unsubscribe = onUserProfileUpdate(currentUser?.uid, (userInfo: UserInfo) => {
        if (userInfo) {
          setCurrentUserInfo(userInfo)
          setProfileUpdated(true)
        }
      })
      return unsubscribe
    }
  }, [currentUser])

  const value = {
    currentUser,
    error,
    currentUserInfo,
    setError,
    login,
    register,
    logout,
    profileUpdated
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
