"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Users, CreditCard, Lock, Building2, UserCheck } from "lucide-react"
import Link from "next/link"
import MyHeader from "@/app/components/myHeader"
import Hero from "@/app/components/Hero"
import Footer from "../components/Footer"
import { useRouter } from "next/navigation"



export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <MyHeader />
      {/* Hero Section */}
      <Hero />

      <div className="text-center my-8 mx-auto w-1/3">
        <img className="mx-auto w-full" src="/assets/E-Wallet-pana.png" alt="Description of image" />

          <Button 
          onClick={() => router.push('/auth/login')}
          className="mx-auto h-12 mt-2 w-full text-xl text-center bg-blue-600 hover:bg-blue-700 text-white"
    
          >
        Proceed
      </Button>
      </div>
    

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Spectrum MFB?</h3>
            <p className="text-gray-600">Trusted by corporations for secure and efficient banking</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Bank-Grade Security</h4>
              <p className="text-gray-600 text-sm">Multi-layer authentication with biometric and token-based security</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h4>
              <p className="text-gray-600 text-sm">Comprehensive approval workflows with maker-checker authorization</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Digital Receipts</h4>
              <p className="text-gray-600 text-sm">Authenticated proof of payment with digital stamps and verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/ >

    </div>
  )
}