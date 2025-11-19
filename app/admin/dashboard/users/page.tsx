'use client'

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserPlus } from "lucide-react"
import CreateUserModal from './components/create-user-modal'
import UserFilters from './components/UserFilters'
import UserTable from './components/UserTable'
import { useAuth } from '@/providers/auth-provider'
import { useUsers } from '@/hooks/useUsers'
import { UserResponse } from '@/lib/interface'

// Local UI user shape used by this page (keeps UI types separate from API types)
type UIUser = Partial<UserResponse>




export default function ManageUsers() {
  const { profile } = useAuth()
  const { users, isLoading, error, updateUser, deleteUser } = useUsers()
  const [filteredUsers, setFilteredUsers] = useState<UIUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  // status removed — backend doesn't return a status field in the current API
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  console.log(users)

 

  useEffect(() => {
    // 'users' may come from the hook as any[], normalize to UIUser
    const list: UIUser[] = Array.isArray(users) ? users : []

    let filtered = list.filter((user) => {
      const name = (user.name || '').toString()
      const email = (user.email || '').toString()
      const company = (user.company_name || '').toString()

      const matchesSearch =
        searchTerm === '' ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === 'all' || (user.roles?.[0] ?? user.role ?? '').toString() === roleFilter

      return matchesSearch && matchesRole
    })

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  // helpers moved into row/table components

  const handleUserAction = async (action: string, userId?: string | number) => {
    if (userId === undefined || userId === null) return
    const idStr = String(userId)
    try {
      switch (action) {
        case 'activate':
          if (updateUser) await updateUser({ id: idStr, status: 'active' } as any)
          break
        case 'deactivate':
          if (updateUser) await updateUser({ id: idStr, status: 'inactive' } as any)
          break
        case 'delete':
          if (deleteUser) await deleteUser(idStr)
          break
      }
    } catch (err) {
      console.error('User action failed', err)
    }
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Manage users</h1>
                {/* <p className="text-muted-foreground">Manage users</p> */}
              </div>
              {profile?.role === 'maker' && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              )}
            </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        onReset={() => { setSearchTerm(''); setRoleFilter('all') }}
      />

      {/* Users Table */}
      <Card>
        <UserTable users={filteredUsers} isLoading={isLoading} onAction={handleUserAction} />

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No users found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Card>
      {/* Create User Modal */}
      <CreateUserModal open={isModalOpen} onOpenChange={setIsModalOpen} />

    </div>
  )
}
