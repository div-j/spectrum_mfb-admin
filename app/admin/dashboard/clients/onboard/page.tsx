 'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useCompany } from '@/hooks/useCompany'

interface NewCompany {
  name: string
  email: string
  phone?: string
  address?: string
  rcn?: string
  tin?: string
  account_no?: string
  daily_transfer_limit?: string
  single_transfer_limit?: string
}

export default function CreateCorporateUserFlow() {
  const [currentStep, setCurrentStep] = useState<'form' | 'review' | 'success'>('form')
  const [data, setData] = useState<NewCompany>({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    rcn: '', 
    tin: '', 
    account_no: '', 
    daily_transfer_limit: '', 
    single_transfer_limit: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const { createCompany, isCreating } = useCompany()

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!data.name.trim()) newErrors.companyName = 'Company name is required'
    if (!data.email.trim()) newErrors.companyEmail = 'Company email is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setCurrentStep('review')
  }

  const handleConfirm = async () => {
    try {
        const resp = await createCompany({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          rcn: data.rcn || '',
          tin: data.tin || '',
          account_no: data.account_no || '',
          daily_transfer_limit: data.daily_transfer_limit || '',
          single_transfer_limit: data.single_transfer_limit || ''
        })
        // Log the successful response so it's visible in the browser console
        console.log('createCompany response:', resp)
      setCurrentStep('success')
    } catch (err) {
      console.error('Failed to create company', err)
    }
  }

  const resetForm = () => {
    setData({ name: '', email: '', phone: '', address: '', rcn: '', tin: '' })
    setErrors({})
    setCurrentStep('form')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* FORM STEP */}
        {currentStep === 'form' && (
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Create Corporate Client</CardTitle>
                  <CardDescription className="text-base">
                    Fill in company details to create a new corporate account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
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
                        value={data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, name: e.target.value }))}
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
                        value={data.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, email: e.target.value }))}
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
                        value={data.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyAddress" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        id="companyAddress"
                        placeholder="Enter company address"
                        value={data.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyRcn" className="text-sm font-medium">
                        RCN (Registration Number)
                      </Label>
                      <Input
                        id="companyRcn"
                        placeholder="RC-XXXXXXX"
                        value={data.rcn}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, rcn: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyTin" className="text-sm font-medium">
                        TIN (Tax ID)
                      </Label>
                      <Input
                        id="companyTin"
                        placeholder="TIN-XXXXXXX"
                        value={data.tin}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, tin: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyAccountNo" className="text-sm font-medium">
                        Account Number
                      </Label>
                      <Input
                        id="companyAccountNo"
                        placeholder="1234567890"
                        value={data.account_no}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, account_no: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDailyLimit" className="text-sm font-medium">
                        Daily Transfer Limit
                      </Label>
                      <Input
                        id="companyDailyLimit"
                        placeholder="e.g. 600000"
                        value={data.daily_transfer_limit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, daily_transfer_limit: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySingleLimit" className="text-sm font-medium">
                        Single Transfer Limit
                      </Label>
                      <Input
                        id="companySingleLimit"
                        placeholder="e.g. 200000"
                        value={data.single_transfer_limit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(prev => ({ ...prev, single_transfer_limit: e.target.value }))}
                      />
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
            </CardContent>
          </Card>
        )}

        {/* REVIEW STEP */}
        {currentStep === 'review' && (
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Review Details</CardTitle>
                  <CardDescription className="text-base">
                    Please review company information before confirming
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
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
                      <p className="text-sm font-semibold">{data.name || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm font-semibold">{data.email || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm font-semibold">{data.phone || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="text-sm font-semibold">{data.address || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">RCN</p>
                      <p className="text-sm font-semibold">{data.rcn || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">TIN</p>
                      <p className="text-sm font-semibold">{data.tin || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                      <p className="text-sm font-semibold">{data.account_no || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Daily Transfer Limit</p>
                      <p className="text-sm font-semibold">{data.daily_transfer_limit || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Single Transfer Limit</p>
                      <p className="text-sm font-semibold">{data.single_transfer_limit || 'Not provided'}</p>
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
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Confirm & Create'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SUCCESS STEP */}
        {currentStep === 'success' && (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12 space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Corporate Client Created!</h2>
                <p className="text-muted-foreground text-lg">
                  The company has been created successfully.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-6 max-w-md mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{data.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account No:</span>
                    <span className="font-medium">{data.account_no || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6">
                <Button variant="outline" onClick={resetForm} className="sm:w-auto">
                  Create Another
                </Button>
                <Link href="/admin/dashboard">
                  <Button className="sm:w-auto">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
