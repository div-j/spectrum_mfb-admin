import { NextResponse } from 'next/server'
import { admins } from '@/lib/mock-data'

// POST /admin/api/administrator/signin
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find admin by email (in a real app, you'd hash and compare passwords)
    const admin = admins.find(a => a.email === email)

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // For mock purposes, accept any password for existing admins
    // In production, you'd verify the hashed password
    
    return NextResponse.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          phone: admin.phone,
          status: admin.status
        }
      }
    })

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}