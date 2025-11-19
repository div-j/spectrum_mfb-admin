import React from 'react'
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Users, CreditCard, Lock, Building2, UserCheck } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PortalSelection() {
  return (
      <section className="py-16 px-4">
          {/* Portal Selection */}
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Portal</h3>
            <p className="text-gray-600">Select the appropriate interface for your role</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin Portal Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Admin Portal</CardTitle>
                <CardDescription className="text-gray-600">
                  Internal use only - For Spectrum MFB staff
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span>Biometric Authentication</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Corporate Entity Registration</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>User Role Management</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Lock className="w-4 h-4 text-red-600" />
                    <span>Security & Compliance</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-700">
                    Network Restricted Access
                  </Badge>
                  <Link href="/admin/login" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group">
                      Access Admin Portal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Customer Portal Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Customer Portal</CardTitle>
                <CardDescription className="text-gray-600">
                  For corporate clients and authorized users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Entrust Soft Token Authentication</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Payment Initiation</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>Transaction Approvals</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span>Proof of Payment</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700">
                    Cloud-Based Access
                  </Badge>
                  <Link href="/customer/login" className="block">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white group">
                      Access Customer Portal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}
