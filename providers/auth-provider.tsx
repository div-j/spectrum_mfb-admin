'use client'

import { adminProfile } from '@/lib/interface'
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY
const api = axios.create({
  baseURL: '/api/v1/admin',
  headers: { 
    'Content-Type': 'application/json',
    'spectrumz-mobile': API_KEY,
    
   },
})



type AdminUser = {
  id: string,
  email: string,
  role: string
}

const adminData = {
  id: "admin-001",
  name: "Ebite Zion",
  email: "divinejohn65@gmail.com",
  role: "maker",
  phone: "+234 803 555 9921",
}

interface adminResp {
  data: string,
  status: string,
  status_code: string
}

interface AuthContextType {
  user: AdminUser | null
  profile: adminProfile | null
  token: string | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, role: "admin1" | "admin2") => Promise<adminResp | null> // Fix type
  activateAdmin: (email: string, otp: string) => Promise<adminResp | null>
  login: (email: string, password: string) => Promise<adminResp | null>
  verifyOtp: (email: string, password: string, otp: string) => Promise<void>
  signOut: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [profile, setProfile] = useState<adminProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

   // Sign-up Admin
  const signUp = async (email: string, password: string, role: "admin1" | "admin2"): Promise<adminResp | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/sign_up', { email, password, role })
      if (res.data.status_code === "00") {
        toast.success('Sign-up successful! Please check your email for the OTP to activate your account.')
        return res.data
      } else {
        setError(res.data.status || res.data.error || 'Sign-up failed') // Fix error handling
        toast.error(res.data.status || res.data.error || 'Sign-up failed')
        return null
      }
    } catch (err: any) {
      setError(err.response?.data?.error_msg?.email || 'Sign-up failed')
      toast.error(err.response?.data?.error_msg?.email || 'Sign-up failed')
      return null
    } finally {
      setLoading(false)
    }
  }

   // Activate Admin with OTP
const activateAdmin = async (email: string, otp: string): Promise<adminResp | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/activate', { email, otp })

      if (res.data.status_code === "00") {
        toast.success('Activation successful! Your account is now active.')
        return res.data
      } else {
        setError(res.data.status || res.data.error || 'Activation failed') // Fix error handling
        toast.error(res.data.status || res.data.error || 'Activation failed')
        return null
      }
    } catch (err: any) {
      setError(err.response?.data?.error_msg || 'Activation failed')
      toast.error(err.response?.data?.error_msg || 'Activation failed') // Fix error access
      return null
    } finally {
      setLoading(false)
    }
  }
  
  // Login Admin (sends OTP email)
  const login = async (email: string, password: string): Promise<adminResp | null> => { // Fix return type
    setLoading(true)
    setError(null)
    try {
      const resp = await api.post('/login', { email, password })
      if (resp.data.status_code === "00") {
        toast.success('Login successful! Please check your email for the OTP to verify your account.')
        return resp.data
      } else {
        setError(resp.data.error?.email || resp.data.status || 'Login failed')
        toast.error(resp.data.error?.email || resp.data.status || 'Login failed')
        return null
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.email || err?.response?.data?.error_msg || 'Login failed')
      toast.error('Login failed')
      return null 
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP and get final JWT token
   // Verify OTP and get final JWT token
  const verifyOtp = async (email: string, password: string, otp: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/authentication', { email, password, otp })
      
      if(response.status == 201) {

        const token = response.data.data.authentication_token.token
        
        const userData = {
        id: response.data.data.user_id,
        email: response.data.data.user_email,
        role: response.data.data.role,
      }
        // Set state first
        setToken(token)
        setUser(userData)

        // Then set cookies
        Cookies.set('admin_token', token, { expires: 1 })
        Cookies.set('admin_user', JSON.stringify(userData), { expires: 1 })


        toast.success('OTP verification successful! You are now logged in.')

      } else {
        setError(response?.data.status)
        toast.error(response?.data.status || 'OTP verification failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.status || 'OTP verification failed')
      toast.error('OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  /** SIGN OUT */
  const signOut = () => {
    setUser(null)
    setProfile(null)
    setToken(null)
    setUser(null)
    Cookies.remove('admin_token')
    Cookies.remove('admin_user') // Remove role cookie
    setLoading(false)
  }

  useEffect(() => {
    const savedToken = Cookies.get('admin_token')
     const savedUser = Cookies.get('admin_user')
    
    
    if (savedToken) {
      setToken(savedToken)
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    
    // Set default admin profile for dev/fallback
    setProfile({
      id: adminData.id,
      name: adminData.name,
      email: adminData.email,
      role: adminData.role as 'maker' | 'authorizer',
      phone: adminData.phone,
    })
    setLoading(false)
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    token,
    loading,
    error,
    signUp,
    activateAdmin,
    login,
    verifyOtp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}