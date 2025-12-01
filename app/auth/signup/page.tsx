"use client"

import React, { useState } from "react"
import { Building2, Mail, Lock, ArrowRight, ArrowLeft, UserCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"

export default function AdminSignup() {
  const router = useRouter()
  const { signUp, activateAdmin, error: authError, loading } = useAuth()

  const [step, setStep] = useState<"signup" | "activate">("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin1" | "admin2" | "">("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  // Step 1: Sign up
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Include role in signup
    const result = await signUp(email, password, role as "admin1" | "admin2")
    if (result && result.status_code === "00") {
        setStep("activate") 
    }
  }

  // OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  // Step 2: Activate admin
  const handleActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpToken = otp.join("")

    const result = await activateAdmin(email, otpToken)
    if (result && result.status_code === "00") {
      router.push("/auth/login") // Redirect after successful activation
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <section className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <img src="/assets/login.png" className="w-full max-w-lg h-auto object-contain" />
      </section>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:w-1/2">
        <div className="w-full max-w-md mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            {step === "signup" ? (
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2 text-black" />
                Back to Home
              </Link>
            ) : (
              <button
                onClick={() => setStep("signup")}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Signup
              </button>
            )}
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-7 w-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Spectrum MFB</h1>
            </div>
            <p className="text-muted-foreground">Admin Registration</p>
          </div>

          {/* Signup Step */}
          {step === "signup" ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Enter your details to register as admin</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Admin Role</Label>
                    <Select value={role} onValueChange={(value: "admin1" | "admin2") => setRole(value)} required>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Select admin role" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin1">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Admin 1</span>
                            <span className="text-sm text-muted-foreground">Maker - Create transactions</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin2">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Admin 2</span>
                            <span className="text-sm text-muted-foreground">Authorizer - Approve transactions</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {authError && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{authError}</div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !role}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <div>
                  <p className="text-sm text-center text-muted-foreground mt-4">Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>  
              </CardContent>
            </Card>
          ) : (
            // ...existing OTP activation step remains the same...
            <Card>
              <CardHeader>
                <CardTitle>Activate Account</CardTitle>
                <CardDescription>Enter the 6-digit OTP sent to your email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleActivateSubmit} className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-lg font-semibold"
                        required
                      />
                    ))}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || otp.some((d) => !d)}>
                    {loading ? "Activating..." : "Activate"}
                  </Button>

                  {authError && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{authError}</div>
                  )}

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("signup")
                        setOtp(["", "", "", "", "", ""])
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Secured by Spectrum MFB</p>
          </div>
        </div>
      </div>
    </div>
  )
}