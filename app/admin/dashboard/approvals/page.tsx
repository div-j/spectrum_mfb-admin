'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import ApproveModal from './components/approve-modal'

interface PendingAction {
  id: string
  type: string
  description: string
  initiatedBy: string
  createdAt: string
  status: string
  approvedBy?: string
  approvedAt?: string
  approverComment?: string
  payload: any
}

export default function ApprovalsPage() {
  const { profile } = useAuth()
  const [actions, setActions] = useState<PendingAction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState<PendingAction | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchPendingActions()
  }, [])

  const fetchPendingActions = async () => {
    try {
      const response = await fetch('/admin/api/mock/pending-actions')
      const data = await response.json()
      setActions(data.data || [])
    } catch (error) {
      console.error('Failed to fetch pending actions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (action: PendingAction) => {
    setSelectedAction(action)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedAction(null)
  }

  const handleActionProcessed = () => {
    fetchPendingActions() // Refresh the list
  }

  if (profile?.role !== 'authorizer') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-500">You do not have permission to view approvals.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground">Review and approve pending actions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions Awaiting Approval</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Initiated By</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No pending actions
                  </TableCell>
                </TableRow>
              ) : (
                actions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {action.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{action.description}</TableCell>
                    <TableCell>{action.initiatedBy}</TableCell>
                    <TableCell>{new Date(action.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={action.status === 'pending' ? 'secondary' : 'default'}>
                        {action.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {action.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReview(action)}
                        >
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ApproveModal
        open={modalOpen}
        action={selectedAction}
        onOpenChange={handleModalClose}
        onSuccess={handleActionProcessed}
      />
    </div>
  )
}