import React from 'react'
import {
  Building2,
  Home,
  User,
  Plus,
  Users,
  FilePlus,
  Settings,
  LogOut,
  CheckCircle,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import CreateUserModal from '../users/components/create-user-modal'
import Cookies from 'js-cookie';


export default function SideBar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = React.useState(false)  // Add state for modal
  console.log("User Role in SideBar:", user);


  const handleLogout = async () => {
     signOut()
    router.push("/auth/login")
  }

  const getLinkClassName = (href: string) => {
  const base = "flex items-center space-x-2 px-3 py-2 rounded-lg transition text-sm font-medium"
  const active = "bg-primary text-primary-foreground"
  const inactive = "hover:bg-accent text-foreground"

  return `${base} ${pathname === href ? active : inactive}`
}

  const getUserInitials = () => user?.email?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"
  const getUserName = () => user?.email || "Admin"
  const getUserRole = () => user?.role?.toUpperCase() 
  console.log(getUserRole())

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Spectrum MFB</h1>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin/dashboard" className={getLinkClassName("/admin/dashboard")}>
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        {/* company Section */}
        <div className="pt-2 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground px-3 mb-1">Clients</p>
          <Link href="/admin/dashboard/clients" className={getLinkClassName("/admin/clients/company")}>
            <Users className="w-5 h-5" />
            <span>View Companies</span>
          </Link>
          {/* Onboard New Client - Only for Makers */}
          {user?.role === 'maker' && (
            <Link href="/admin/dashboard/clients/onboard" className={getLinkClassName("/admin/dashboard/clients/onboard")}>
              <FilePlus className="w-5 h-5" />
              <span>Onboard New Company</span>
            </Link>
          )}
        </div>

        {/* Users Section */}
        <div className="pt-3">
          <p className="text-xs font-semibold text-muted-foreground px-3 mb-1">Users</p>
          <Link href="/admin/dashboard/users" className={getLinkClassName("/admin/dashboard/users")}>
            <User className="w-5 h-5" />
            <span>Manage Users</span>
          </Link>
          {/* New User Button - Only for Makers */}
          {user?.role === 'admin1' && (
            <Button
              variant="ghost"
              className={'flex items-center justify-start space-x-2 px-3 py-2 rounded-lg transition text-sm font-medium w-full'}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              <span>New User</span>
            </Button>
          )}
        </div>

        {/* Approvals Section - Only for Authorizers */}
        {user?.role === 'admin2' && (
          <div className="pt-3">
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-1">Approvals</p>
            <Link href="/admin/dashboard/approvals" className={getLinkClassName("/admin/dashboard/approvals")}>
              <CheckCircle className="w-5 h-5" />
              <span>Pending Approvals</span>
            </Link>
          </div>
        )}
      </nav>

      {/* user + Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{getUserName()}</p>
            <p className="text-xs text-muted-foreground">{getUserRole()}</p>
          </div>
        </div>

        <div className="space-y-2">
          {/* <Link href="/admin/dashboard/user">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" /> user
            </Button>
          </Link> */}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>
       {/* Render the modal */}
      <CreateUserModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
