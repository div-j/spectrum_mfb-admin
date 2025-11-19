'use client'

import { adminProfile } from '@/lib/interface'
import { createContext, useContext, useEffect, useState } from 'react'

// Auth storage keys
const LOCAL_SESSION_KEY = 'admin_session'

type AdminUser = {
  id: string
  email: string
  name: string
  role: string
  phone: string
  // status: string
}

const adminData = {
    id: "admin-001",
    name: "Ebite Zion",
    email: "divinejohn65@gmail.com",
    role: "maker", // Admin 1
    phone: "+234 803 555 9921",
}

interface AuthContextType {
  user: AdminUser | null
  profile: adminProfile | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error?: any }>
  signInWithOtp: (email: string) => Promise<{ error?: any }>
  verifyOtp: (email: string, token: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function setSession(user: AdminUser | null) {
  if (user) localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ userId: user.id, user }))
  else localStorage.removeItem(LOCAL_SESSION_KEY)
}

function getSessionUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY)
    if (!raw) return null
    const obj = JSON.parse(raw)
    return obj.user ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [profile, setProfile] = useState<adminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/admin/api/administrator/profile?id=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        const adminData = data.data.admin
        const profileData: adminProfile = {
          id: adminData.id,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role,
          phone: adminData.phone
        }
        return profileData
      }
      return null
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      return null
    }
  }

  const signInWithPassword = async (email: string, password: string) => {
    try {
      const response = await fetch('/admin/api/administrator/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Sign in failed' }
      }

      const adminUser = data.data.admin
      setUser(adminUser)
      setSession(adminUser)
      
      const profileData = await fetchProfile(adminUser.id)
      setProfile(profileData)

      return {}
    } catch (error) {
      return { error: 'Network error' }
    }
  }

  const signInWithOtp = async (email: string) => {
    try {
      const response = await fetch('/admin/api/administrator/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'OTP request failed' }
      }

      // In development, log the OTP for testing
      if (process.env.NODE_ENV === 'development' && data.otp) {
        console.log(`[DEV] OTP for ${email}: ${data.otp}`)
      }

      return {}
    } catch (error) {
      return { error: 'Network error' }
    }
  }

  const verifyOtp = async (email: string, token: string) => {
    try {
      const response = await fetch('/admin/api/administrator/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: token }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'OTP verification failed' }
      }

      const adminUser = data.data.admin
      setUser(adminUser)
      setSession(adminUser)
      
      const profileData = await fetchProfile(adminUser.id)
      setProfile(profileData)

      return {}
    } catch (error) {
      return { error: 'Network error' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/admin/api/administrator/signout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Signout API call failed:', error)
    } finally {
      setUser(null)
      setProfile(null)
      setSession(null)
    }
  }

  useEffect(() => {
    // Initialize from localStorage session
    const init = async () => {
      setLoading(true)
      const sessionUser = getSessionUser()
      if (sessionUser) {
        setUser(sessionUser)
        const profileData = await fetchProfile(sessionUser.id)
        // use a properly-typed adminProfile for the initial mock/profile fallback
        setProfile({
          id: adminData.id,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role as 'maker' | 'authorizer',
          phone: adminData.phone
        })
      }
       setProfile({
          id: adminData.id,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role as 'maker' | 'authorizer',
          phone: adminData.phone
        })
      
      setLoading(false)
    }
    init()
  }, [])

  const value: AuthContextType = { 
    user, 
    profile, 
    loading, 
    signInWithPassword,
    signInWithOtp, 
    verifyOtp, 
    signOut 
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}