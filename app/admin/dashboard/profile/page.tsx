"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Mail, Phone, User, ShieldCheck, CalendarClock, MapPin, Loader2 } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  // Get user initials from profile name
  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Get user role display name
  const getUserRoleDisplay = () => {
    if (profile?.role) {
      return profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    }
    return 'User'
  }

  // Format last login date
  const getLastLogin = () => {
    if (user?.last_sign_in_at) {
      return new Date(user.last_sign_in_at).toLocaleString()
    }
    return 'Never'
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              {profile?.name || 'User'}
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" /> {profile?.company?.name || 'Company'}
              <span className="mx-1">•</span>
              <User className="h-4 w-4" /> {getUserRoleDisplay()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user?.email || 'Not available'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{profile?.company?.phone || 'Not available'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium">{getUserRoleDisplay()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Employee ID</div>
                <div className="font-medium">{profile?.id || 'Not available'}</div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="text-sm text-muted-foreground">Company Address</div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{profile?.company?.address || 'Not available'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Security & Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Two-Factor Authentication</div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <Badge variant="default">
                  Enabled
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Last Login</div>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{getLastLogin()}</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Company</div>
              <div className="font-medium">{profile?.company?.name || 'Not available'}</div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Account Status</div>
              <Badge variant="default">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
