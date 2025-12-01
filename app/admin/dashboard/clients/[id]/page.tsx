'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, ArrowLeft, Mail, Phone, MapPin, FileText, DollarSign, Building2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Company } from '@/lib/interface'
import { useCompany } from '@/hooks/useCompany'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'

export default function ClientDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { companies, isLoading, deleteCompany } = useCompany()
  const [company, setCompany] = useState<Company | null>(null)
  const {user} = useAuth()

  useEffect(() => {
    if (companies && id) {
      const found = companies.find((c: Company) => String(c.id) === String(id))
      setCompany(found ?? null)
    }
  }, [companies, id])

  const handleDelete = async () => {
    if (!company || !deleteCompany) return
    await deleteCompany(String(company.id))
    router.back()
  }

 

  if (isLoading || !company) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-8 w-48" /> {/* Back button skeleton */}
        <Skeleton className="h-24 w-full rounded-lg" /> {/* Header card skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-lg" /> {/* Additional details skeleton */}
        <div className="flex gap-4 justify-end">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Button>

      {/* Company Header */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-blue-600" />
              <div>
                <CardTitle className="text-3xl">{company.name}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Company ID: {company.id}
                </CardDescription>
                <CardDescription className="text-sm mt-1">
                  Created At: {formatDate(company.created_at)}
                </CardDescription>
                
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold break-all">{company.email || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{company.phone || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-sm">{company.address || 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance & Registration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Compliance & Registration
          </CardTitle>
          <CardDescription>Tax and registration details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">RCN (Registration)</p>
              <p className="font-mono text-lg font-semibold">{company.rcn || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">TIN (Tax ID)</p>
              <p className="font-mono text-lg font-semibold">{company.tin || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banking Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Banking Information
          </CardTitle>
          <CardDescription>Account and transfer limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Account Number</p>
              <p className="font-mono text-lg font-semibold break-all">{company.account_no || 'N/A'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Daily Transfer Limit</p>
              <p className="font-mono text-lg font-semibold">{formatCurrency(company.daily_transfer_limit)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Single Transfer Limit</p>
              <p className="font-mono text-lg font-semibold">{formatCurrency(company.single_transfer_limit)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
  
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => router.back()}>
          Close
        </Button>
     {user?.role === "admin1" && (
          <>
            <Button className="gap-2">
              Edit Company
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Company
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
