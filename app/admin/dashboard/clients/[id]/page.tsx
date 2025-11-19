'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User, Mail, Building2, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Company, User as UserType } from '@/lib/interface'

interface ClientData extends Company {
  totalUsers: number
  totalTransactions: number
  balance: number
  currency: string
  lastActivity: string
}

export default function ClientDetailsPage() {
  const { id } = useParams()
  const [client, setClient] = useState<ClientData | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Fetch companies
        const companiesRes = await fetch('/admin/api/mock/companies')
        const companiesData = await companiesRes.json()
        const company = companiesData.data.find((c: Company) => c.id === id)

        if (!company) {
          setError('Company not found')
          return
        }

        // Fetch users
        const usersRes = await fetch('/admin/api/mock/users')
        const usersData = await usersRes.json()
        const companyUsers = usersData.data.filter((u: UserType) => u.companyId === company.id)

        // Mock additional data
        const clientData: ClientData = {
          ...company,
          totalUsers: companyUsers.length,
          totalTransactions: Math.floor(Math.random() * 200) + 50, // Mock
          balance: Math.floor(Math.random() * 50000000) + 10000000, // Mock
          currency: 'NGN',
          lastActivity: companyUsers.length > 0 ? companyUsers[0].lastLogin : company.createdAt
        }

        setClient(clientData)
        setUsers(companyUsers)
      } catch (err) {
        setError('Failed to load client data')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchClientData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="p-4 md:p-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-500">{error || 'Client not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, string> = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
    }
    return (
      <Badge variant="outline" className={variants[status] || 'bg-gray-100 text-gray-700 border-gray-200'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Client Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Client</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-lg">{client.name}</div>
                <div className="text-xs text-muted-foreground">ID: {client.id}</div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {client.email}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Joined {formatDate(client.createdAt)}
            </div>
            <div className="mt-2">{getStatusBadge('active')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.totalUsers}</div>
            <div className="text-xs text-muted-foreground">Total users</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(client.balance)}</div>
            <div className="text-xs text-muted-foreground">Available ({client.currency})</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Company Users</CardTitle>
          <CardDescription>Users associated with {client.name}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}