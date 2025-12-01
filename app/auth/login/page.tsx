"use client"

import React, { useState } from "react"
import { Building2, Mail, ArrowRight, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"

export default function AdminLogin() {
  const router = useRouter()
  const { login, verifyOtp, token,error,loading: isLoading} = useAuth()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  

  // Step 1: Send OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
      const result = await login(email, password)
      if(result){
      setStep("otp") // Only proceed to next step on success
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

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpToken = otp.join("")
   

   
      await verifyOtp(email, password, otpToken)
      router.push("/admin/dashboard") // redirect after successful login

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
            {step === "email" ? (
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5  mr-2 text-black" />
                Back to Home
              </Link>
            ) : (
              <button
                onClick={() => setStep("email")}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Email
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
            <p className="text-muted-foreground">Admin Portal</p>
          </div>

          {/* Email Step */}
          {step === "email" ? (
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your email and password to receive a one-time password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <div>
                  <p className="text-sm text-center text-muted-foreground mt-4">Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            // OTP Step
            <Card>
              <CardHeader>
                <CardTitle>Enter OTP</CardTitle>
                <CardDescription>Enter the 6-digit OTP sent to your email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOtpSubmit} className="space-y-6">
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

                  <Button type="submit" className="w-full" disabled={isLoading || otp.some((d) => !d)}>
                    {isLoading ? "Verifying..." : "Sign In"}
                  </Button>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
                  )}

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email")
                        setOtp(["", "", "", "", "", ""])
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Request new OTP
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
