import { pendingActions, mockCompanies, mockUsers } from '@/lib/mock-data'
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

    // Mark as approved
    action.status = 'approved'
    action.approvedBy = approverId
    action.approvedAt = new Date().toISOString()
    action.approverComment = comment || ''

    // Perform the action based on type
    if (action.type === 'company_onboarding' && action.payload?.company) {
      // Add company to mockCompanies
      mockCompanies.push(action.payload.company)

      // Add users if any
      if (action.payload.users) {
        action.payload.users.forEach((userData: any) => {
          const newUser = {
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: userData.name,
            email: userData.email,
            phone: '',
            role: userData.role,
            status: 'active',
            companyId: action.payload.company.id,
            companyName: action.payload.company.name,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
          mockUsers.push(newUser)
        })
      }
    } else if (action.type === 'mandate_update' && action.payload) {
      if (action.payload.action === 'add_user' && action.payload.user) {
        const newUser = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: action.payload.user.name,
          email: action.payload.user.email,
          phone: '',
          role: action.payload.user.role,
          status: 'active',
          companyId: action.payload.companyId,
          companyName: mockCompanies.find(c => c.id === action.payload.companyId)?.name || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
        mockUsers.push(newUser)
      }
    } else if (action.type === 'account_unlock' && action.payload?.userId) {
      const user = mockUsers.find(u => u.id === action.payload.userId)
      if (user) {
        user.status = 'active'
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Action approved successfully',
      data: action
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to approve action'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}