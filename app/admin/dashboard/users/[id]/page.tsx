'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Loader2, ArrowLeft, Mail, Phone, MapPin, FileText, DollarSign, Building2, CheckCircle2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { User, CorporateUser, UserResponse } from '@/lib/interface'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useUsers } from '@/hooks/useUsers'
import { toast } from 'sonner'

export default function UserDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { users, isLoading, deleteUser, updateUserStatus, isUpdatingStatus } = useUsers()
  const [user, setUser] = useState<UserResponse | null>(null)
  const [currentStep, setCurrentStep] = useState<'confirm' | 'success' | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (users && id) {
      const found = users.find((u: UserResponse) => String(u.id) === String(id))
      setUser(found ?? null)
    }
  }, [users, id])

  const handleDelete = async () => {
    if (!user || !deleteUser) return
    await deleteUser(String(user.id))
    router.back()
  }

  const handleActivate = () => {
    setCurrentStep('confirm')
    setModalOpen(true)
  }

  const handleConfirmActivate = async () => {
    try {
      await updateUserStatus({ userId: Number(user!.id), activated: true })
      setCurrentStep('success')
    } catch (error) {
      // Error handled in hook
      setModalOpen(false)
      setCurrentStep(null)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setCurrentStep(null)
  }

  const handleDeactivate = async () => {
    try {
      await updateUserStatus({ userId: Number(user!.id), activated: false })
      toast.success('User deactivated successfully!')
    } catch (error) {
      // Error handled in hook
    }
  }

  if (isLoading || !user) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-lg" />
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
        <Skeleton className="h-16 w-full rounded-lg" />
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
        Back to Users
      </Button>

      {/* User Header */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-blue-600" />
              <div>
                <CardTitle className="text-3xl">{user.name}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  User ID: {user.id}
                </CardDescription>
                <CardDescription className="text-sm mt-1">
                  Created At: {user.created_at ? formatDate(user.created_at) : 'N/A'}
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  {user.roles?.map((role) => (
                    <Badge key={role} variant="secondary">{role}</Badge>
                  ))}
                </div>
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
            <p className="font-semibold break-all">{user.email || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{user.phone_number || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-sm">{user.address || 'N/A'}</p>
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
              <p className="font-mono text-lg font-semibold">{user.company_rcn || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">TIN (Tax ID)</p>
              <p className="font-mono text-lg font-semibold">{user.company_tin || 'Not provided'}</p>
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
              <p className="font-mono text-lg font-semibold break-all">{user.account_no || 'N/A'}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Daily Transfer Limit</p>
              <p className="font-mono text-lg font-semibold">{formatCurrency(user.daily_transfer_limit)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Single Transfer Limit</p>
              <p className="font-mono text-lg font-semibold">{formatCurrency(user.single_transfer_limit)}</p>
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
          <p>Roles: {user.roles?.join(', ') || 'N/A'}</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => router.back()}>
          Close
        </Button>
        <Button variant="destructive" onClick={handleDeactivate} disabled={isUpdatingStatus}>
          {isUpdatingStatus ? 'Processing...' : 'Deactivate User'}
        </Button>
        <Button onClick={handleActivate} disabled={isUpdatingStatus}>
          {isUpdatingStatus ? 'Processing...' : 'Approve User'}
        </Button>
      </div>

      {/* Approval Modal */}
      <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          {currentStep === 'confirm' && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle>Confirm Approval</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to approve this user? This action will activate the user.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roles:</span>
                  <span className="font-medium">{user.roles?.join(', ') || 'N/A'}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmActivate} disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    'Yes, Approve'
                  )}
                </Button>
              </div>
            </>
          )}

          {currentStep === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">User Approved Successfully!</DialogTitle>
                <DialogDescription className="mt-2">
                  The user has been activated and can now access the system.
                </DialogDescription>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">Approved</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button variant="outline" onClick={() => router.push('/admin/dashboard/users')}>
                  View All Users
                </Button>
                <Button onClick={handleCloseModal}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}