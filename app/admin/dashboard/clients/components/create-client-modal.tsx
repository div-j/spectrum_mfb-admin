'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ArrowLeft, User, CheckCircle2, X } from 'lucide-react'

interface NewCompany {
  name: string
  email: string
  phone?: string
  address?: string
  rcn?: string
  tin?: string
}

interface NewCorporateUser {
  fullName: string
  email: string
  password: string
  role: 'maker' | 'authorizer'
}

interface CreateCorporateUserRequest {
  company: NewCompany
  user: NewCorporateUser
}

interface CreateCorporateClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateCorporateClientModal({ open, onOpenChange }: CreateCorporateClientModalProps) {
  const [currentStep, setCurrentStep] = useState<'form' | 'review' | 'success'>('form')
  const [data, setData] = useState<CreateCorporateUserRequest>({
    company: { name: '', email: '', phone: '', address: '', rcn: '', tin: '' },
    user: { fullName: '', email: '', password: '', role: 'maker' }
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!data.company.name.trim()) newErrors.companyName = 'Company name is required'
    if (!data.company.email.trim()) newErrors.companyEmail = 'Company email is required'
    if (!data.user.fullName.trim()) newErrors.userName = 'User full name is required'
    if (!data.user.email.trim()) newErrors.userEmail = 'User email is required'
    if (!data.user.password.trim() || data.user.password.length < 6)
      newErrors.userPassword = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setCurrentStep('review')
  }

  const handleConfirm = () => setCurrentStep('success')

  const resetForm = () => {
    setData({
      company: { name: '', email: '', phone: '', address: '', rcn: '', tin: '' },
      user: { fullName: '', email: '', password: '', role: 'maker' }
    })
    setErrors({})
    setCurrentStep('form')
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after a short delay to allow modal close animation
    setTimeout(resetForm, 200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* FORM STEP */}
        {currentStep === 'form' && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">Create Corporate Client and User</DialogTitle>
                    <DialogDescription className="text-base">
                      Fill in company and user details to create a new corporate account
                    </DialogDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-semibold text-foreground">Company Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      value={data.company.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, company: { ...prev.company, name: e.target.value } }))}
                      className={errors.companyName ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="text-xs">⚠</span> {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyEmail" className="text-sm font-medium">
                      Company Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      placeholder="company@example.com"
                      value={data.company.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, company: { ...prev.company, email: e.target.value } }))}
                      className={errors.companyEmail ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.companyEmail && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="text-xs">⚠</span> {errors.companyEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyPhone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="companyPhone"
                      placeholder="+234 xxx xxx xxxx"
                      value={data.company.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, company: { ...prev.company, phone: e.target.value } }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyAddress" className="text-sm font-medium">
                      Address
                    </Label>
                    <Input
                      id="companyAddress"
                      placeholder="Enter company address"
                      value={data.company.address}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, company: { ...prev.company, address: e.target.value } }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyRcn" className="text-sm font-medium">
                      RCN (Registration Number)
                    </Label>
                    <Input
                      id="companyRcn"
                      placeholder="RC-XXXXXXX"
                      value={data.company.rcn}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, company: { ...prev.company, rcn: e.target.value } }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyTin" className="text-sm font-medium">
                      TIN (Tax ID)
                    </Label>
                    <Input
                      id="companyTin"
                      placeholder="TIN-XXXXXXX"
                      value={data.company.tin}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, company: { ...prev.company, tin: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* User Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-xl font-semibold text-foreground">User Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userName"
                      placeholder="Enter full name"
                      value={data.user.fullName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, user: { ...prev.user, fullName: e.target.value } }))}
                      className={errors.userName ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.userName && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="text-xs">⚠</span> {errors.userName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-sm font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="user@company.com"
                      value={data.user.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, user: { ...prev.user, email: e.target.value } }))}
                      className={errors.userEmail ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.userEmail && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="text-xs">⚠</span> {errors.userEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userPassword" className="text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userPassword"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={data.user.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, user: { ...prev.user, password: e.target.value } }))}
                      className={errors.userPassword ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.userPassword && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="text-xs">⚠</span> {errors.userPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userRole" className="text-sm font-medium">
                      User Role <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={data.user.role}
                      onValueChange={(value) => setData(prev => ({
                        ...prev,
                        user: { ...prev.user, role: value as 'maker' | 'authorizer' }
                      }))}
                    >
                      <SelectTrigger id="userRole">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maker">Maker - Can create transactions</SelectItem>
                        <SelectItem value="authorizer">Authorizer - Can approve transactions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={resetForm} className="sm:w-auto">
                  Reset Form
                </Button>
                <Button type="submit" className="sm:w-auto">
                  Review Details
                </Button>
              </div>
            </form>
          </>
        )}

        {/* REVIEW STEP */}
        {currentStep === 'review' && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">Review Details</DialogTitle>
                    <DialogDescription className="text-base">
                      Please review all information before confirming
                    </DialogDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-8">
              {/* Company Details Review */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">Company Information</h3>
                </div>

                <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                      <p className="text-sm font-semibold">{data.company.name || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm font-semibold">{data.company.email || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm font-semibold">{data.company.phone || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="text-sm font-semibold">{data.company.address || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">RCN</p>
                      <p className="text-sm font-semibold">{data.company.rcn || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">TIN</p>
                      <p className="text-sm font-semibold">{data.company.tin || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* User Details Review */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">User Information</h3>
                </div>

                <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-sm font-semibold">{data.user.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm font-semibold">{data.user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Role</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold capitalize">{data.user.role}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          data.user.role === 'maker'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {data.user.role === 'maker' ? 'Can create transactions' : 'Can approve transactions'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Password</p>
                      <p className="text-sm font-semibold">{'•'.repeat(8)} (Hidden for security)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('form')}
                  className="sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="sm:w-auto"
                >
                  Confirm & Create
                </Button>
              </div>
            </div>
          </>
        )}

        {/* SUCCESS STEP */}
        {currentStep === 'success' && (
          <div className="text-center py-12 space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600"/>
            </div>
            <h2 className="text-2xl font-bold">Corporate User Created Successfully!</h2>
            <p className="text-muted-foreground">The corporate user and company details have been prepared and are ready for submission.</p>

            <div className="bg-muted/30 rounded-lg p-6 max-w-md mx-auto">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium">{data.company.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User:</span>
                  <span className="font-medium">{data.user.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium capitalize">{data.user.role}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-6">
              <Button variant="outline" onClick={resetForm}>Create Another</Button>
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}