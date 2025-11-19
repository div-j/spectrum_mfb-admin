'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserCheck, UserX, Eye, Edit, Trash2, Search, Filter, Shield, Building2, Calendar, UserPlus } from "lucide-react"
import { useAuth } from '@/providers/auth-provider'
import { useCompany } from '@/hooks/useCompany'
import { Company } from '@/lib/interface';

// Local UI user shape used by this page (keeps UI types separate from API types)
type UIComp = Partial<Company>




export default function ManageUsers() {
  const { profile } = useAuth()
  const { companies, isLoading, error, updateCompany, deleteCompany } = useCompany()
  const [filteredUsers, setFilteredUsers] = useState<UIComp[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  // status removed — backend doesn't return a status field in the current API
  const [roleFilter, setRoleFilter] = useState<string>('all')

  console.log(companies)

 

  useEffect(() => {
	// 'users' may come from the hook as any[], normalize to UIUser
	const list: UIComp[] = Array.isArray(companies) ? companies : []

	let filtered = list.filter((comp) => {
	  const name = (comp.name || '').toString()
	  const email = (comp.email || '').toString()

	  const matchesSearch =
		searchTerm === '' ||
		name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		email.toLowerCase().includes(searchTerm.toLowerCase())


	  return matchesSearch 
	})

	setFilteredUsers(filtered)
  }, [companies, searchTerm])

  const getStatusBadge = (status: string) => {
	const variants = {
	  active: "bg-green-100 text-green-700",
	  inactive: "bg-gray-100 text-gray-700",
	  pending: "bg-yellow-100 text-yellow-700"
	}
	return <Badge variant="outline" className={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>
  }

  const getRoleBadge = (role: string) => {
	const variants = {
	  admin: "bg-purple-100 text-purple-700",
	  authorizer: "bg-blue-100 text-blue-700",
	  maker: "bg-orange-100 text-orange-700"
	}
	return <Badge variant="outline" className={variants[role as keyof typeof variants]}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
  }

  const getUserInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase()
  const formatDate = (dateString: string) => dateString === 'Never' ? 'Never' : new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const handleUserAction = async (action: string, userId?: string | number) => {
	if (userId === undefined || userId === null) return
	const idStr = String(userId)
	try {
	  switch (action) {
		case 'activate':
		  if (updateCompany) await updateCompany({ id: idStr, status: 'active' } as any)
		  break
		case 'deactivate':
		  if (updateCompany) await updateCompany({ id: idStr, status: 'inactive' } as any)
		  break
		case 'delete':
		  if (deleteCompany) await deleteCompany(idStr)
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
				<h1 className="text-3xl font-bold text-foreground">Manage Companies</h1>
				{/* <p className="text-muted-foreground">Manage users</p> */}
			  </div>
			  {profile?.role === 'maker' && (
				<Button
				>
				  <UserPlus className="w-4 h-4 mr-2" />
				  Add Company
				</Button>
			  )}
			</div>

	  {/* Filters */}
	  <Card>
		<CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
		  <div className="space-y-2">
			<label>Search Companies</label>
			<div className="relative">
			  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			  <Input
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search by name, email, company..."
				className="pl-10"
			  />
			</div>
		  </div>

		  {/* Status removed - backend doesn't return a status field currently */}

		  <div className="space-y-2">
			<label>Role</label>
			<Select value={roleFilter} onValueChange={setRoleFilter}>
			  <SelectTrigger><SelectValue placeholder="All Roles" /></SelectTrigger>
			  <SelectContent>
				<SelectItem value="all">All</SelectItem>
				<SelectItem value="initiator">Initiator</SelectItem>
				<SelectItem value="reviewer">Reviewer</SelectItem>
				<SelectItem value="maker">Maker</SelectItem>
			  </SelectContent>
			</Select>
		  </div>

		  <div className="flex items-end">
			<Button
			  variant="outline"
			  onClick={() => { setSearchTerm(''); setRoleFilter('all') }}
			  className="w-full"
			>
			  Reset Filters
			</Button>
		  </div>
		</CardContent>
	  </Card>

	  {/* Users Table */}
	  <Card>
		<Table>
		  <TableHeader>
			<TableRow>
			  <TableHead>User</TableHead>
			  <TableHead>Role</TableHead>
			  <TableHead>Company</TableHead>
			  <TableHead>Phone</TableHead>
			  <TableHead>Activated</TableHead>
			  <TableHead className="text-right">Actions</TableHead>
			</TableRow>
		  </TableHeader>
		  <TableBody>
			{isLoading ? (
			  // show 5 skeleton rows while loading
			  Array.from({ length: 5 }).map((_, i) => (
				<TableRow key={`skeleton-${i}`}>
				  <TableCell>
					<div className="flex items-center space-x-3">
					  <Skeleton className="h-8 w-8 rounded-full" />
					  <div className="flex flex-col">
						<Skeleton className="h-4 w-28 mb-2 rounded" />
						<Skeleton className="h-3 w-40 rounded" />
					  </div>
					</div>
				  </TableCell>
				  <TableCell>
					<Skeleton className="h-4 w-16 rounded" />
				  </TableCell>
				  <TableCell>
					<div className="flex items-center gap-2">
					  <Building2 className="h-4 w-4 text-muted-foreground" />
					  <Skeleton className="h-4 w-32 rounded" />
					</div>
				  </TableCell>
				  <TableCell>
					<Skeleton className="h-4 w-24 rounded" />
				  </TableCell>
				  <TableCell className="text-sm text-muted-foreground">
					<Skeleton className="h-4 w-8 rounded" />
				  </TableCell>
				  <TableCell className="text-right flex gap-2 justify-end">
					<div className="flex gap-2">
					  <Skeleton className="h-8 w-8 rounded" />
					  <Skeleton className="h-8 w-8 rounded" />
					  <Skeleton className="h-8 w-8 rounded" />
					</div>
				  </TableCell>
				</TableRow>
			  ))
			) : filteredUsers.map((user) => (
			  <TableRow key={user.id ?? user.email}>
				<TableCell>
				  <div className="flex items-center space-x-3">
					<Avatar className="h-8 w-8">
					  <AvatarFallback>{getUserInitials(user.name ?? '')}</AvatarFallback>
					</Avatar>
					<div>
					  <div className="font-medium">{user.name ?? '—'}</div>
					  <div className="text-sm text-muted-foreground">{user.email ?? '—'}</div>
					</div>
				  </div>
				</TableCell>
				<TableCell>
				  <div className="flex items-center gap-2">
					<Building2 className="h-4 w-4 text-muted-foreground" />
					{user.company_name ?? '—'}
				  </div>
				</TableCell>
				<TableCell>
				  <div className="flex items-center gap-2">
					{user.phone_number}
				  </div>
				</TableCell>
				<TableCell className="text-sm text-muted-foreground">
					{user.activated ? "Yes":"No"}
				</TableCell>
				<TableCell className="text-right flex gap-2 justify-end">
				  <Button variant="ghost" size="sm">
					<Eye className="w-4 h-4" />
				  </Button>
				  <Button variant="ghost" size="sm">
					<Edit className="w-4 h-4" />
				  </Button>
				  <Button variant="ghost" size="sm" onClick={() => handleUserAction('delete', user.id ?? '')} className="text-red-600">
					<Trash2 className="w-4 h-4" />
				  </Button>
				</TableCell>
			  </TableRow>
			))}
			
		  </TableBody>
		</Table>

		{filteredUsers?.length === 0 &&  (
		  <div className="text-center py-12">
			<Building2 className="w-14 h-14 text-red-500  mx-auto mb-4" />
			<h3 className="text-lg font-semibold text-muted-foreground mb-2">No companies found</h3>
			<p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
		  </div>
		)}
	  </Card>

	</div>
  )
}
