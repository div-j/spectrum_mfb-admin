import { pendingActions } from '@/lib/mock-data'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { actionId, approverId, comment } = body

    const actionIndex = pendingActions.findIndex(a => a.id === actionId)
    if (actionIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Action not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const action = pendingActions[actionIndex]

    // Mark as rejected
    action.status = 'rejected'
    action.approvedBy = approverId
    action.approvedAt = new Date().toISOString()
    action.approverComment = comment || ''

    return new Response(JSON.stringify({
      success: true,
      message: 'Action rejected successfully',
      data: action
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to reject action'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}