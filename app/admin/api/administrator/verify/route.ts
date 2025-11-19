import { NextResponse } from 'next/server'
import { admins } from '@/lib/mock-data'

// Using the same OTP store from otp route (in production, use shared storage)
const otpStore = new Map<string, { otp: string; expires: number }>()

// POST /admin/api/administrator/verify
export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Check if admin exists
    const admin = admins.find(a => a.email === email)
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Verify OTP
    const storedOtp = otpStore.get(email)
    if (!storedOtp) {
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 400 }
      )
    }

    if (storedOtp.expires < Date.now()) {
      otpStore.delete(email)
      return NextResponse.json(
        { error: 'OTP expired' },
        { status: 400 }
      )
    }

    if (storedOtp.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // OTP is valid, clean up and return admin data
    otpStore.delete(email)

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
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}