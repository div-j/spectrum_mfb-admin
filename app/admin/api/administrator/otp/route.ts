import { NextResponse } from 'next/server'
import { admins } from '@/lib/mock-data'

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number }>()

// POST /admin/api/administrator/otp
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP with 5-minute expiry
    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    })

    // In production, send OTP via email/SMS
    console.log(`[MOCK OTP] ${email} -> ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // For demo purposes, include OTP in response (remove in production)
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    })

  } catch (error) {
    console.error('OTP generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}