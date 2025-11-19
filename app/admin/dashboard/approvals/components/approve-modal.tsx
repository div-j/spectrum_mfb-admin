'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useAuth } from '@/providers/auth-provider'

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

interface ApproveModalProps {
  open: boolean
  action: PendingAction | null
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function ApproveModal({ open, action, onOpenChange, onSuccess }: ApproveModalProps) {
  const { profile } = useAuth()
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  if (!action) return null

  const handleDecision = async (decision: 'approve' | 'reject') => {
    if (!profile) return

    setLoading(true)
    try {
      const url = `/admin/api/mock/pending-actions/${decision}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionId: action.id,
          approverId: profile.id,
          comment: comment.trim()
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(
          `Action ${decision}d successfully!`,
          {
            description: `${action.description} has been ${decision}d.`,
          }
        )
        onSuccess()
        onOpenChange(false)
        setComment('')
      } else {
        toast.error(`Failed to ${decision} action`, {
          description: result.message || 'Please try again.',
        })
      }
    } catch (error) {
      toast.error(`Failed to ${decision} action`, {
        description: 'Network error. Please check your connection and try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderPayloadDetails = () => {
    if (!action.payload) return null

    switch (action.type) {
      case 'company_onboarding':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Company Details</h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Name:</span>
                    <p className="text-sm">{action.payload.company?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-sm">{action.payload.company?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Phone:</span>
                    <p className="text-sm">{action.payload.company?.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">RCN:</span>
                    <p className="text-sm">{action.payload.company?.rcn}</p>
                  </div>
                </div>
              </div>
            </div>
            {action.payload.users && action.payload.users.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Users to Add</h4>
                <div className="space-y-2">
                  {action.payload.users.map((user: any, index: number) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-3">
                      <div className="flex justify-between">
                        <span>{user.name}</span>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'mandate_update':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Mandate Update Details</h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Action:</span>
                    <p className="text-sm capitalize">{action.payload.action?.replace('_', ' ')}</p>
                  </div>
                  {action.payload.user && (
                    <>
                      <div>
                        <span className="text-sm font-medium">User Name:</span>
                        <p className="text-sm">{action.payload.user.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">User Email:</span>
                        <p className="text-sm">{action.payload.user.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">User Role:</span>
                        <p className="text-sm">{action.payload.user.role}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 'account_unlock':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Account Unlock Details</h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">User ID:</span>
                    <p className="text-sm">{action.payload.userId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Reason:</span>
                    <p className="text-sm">{action.payload.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div>
            <h4 className="font-medium mb-2">Action Details</h4>
            <pre className="bg-muted/30 rounded-lg p-4 text-xs overflow-auto">
              {JSON.stringify(action.payload, null, 2)}
            </pre>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review {action.type.replace('_', ' ')}</DialogTitle>
          <DialogDescription>
            {action.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Action Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Type:</span>
                <Badge variant="outline" className="capitalize">
                  {action.type.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Initiated By:</span>
                <span className="text-sm">{action.initiatedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">{new Date(action.createdAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payload Details */}
          {renderPayloadDetails()}

          {/* Comment Section */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Add a comment about your decision..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDecision('reject')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Reject'}
            </Button>
            <Button
              onClick={() => handleDecision('approve')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Approve'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}