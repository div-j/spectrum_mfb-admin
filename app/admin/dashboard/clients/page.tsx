'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Trash2, Search, Building2 } from "lucide-react"
import { useAuth } from '@/providers/auth-provider'
import { useCompany } from '@/hooks/useCompany'
import { Company } from '@/lib/interface'
import { useRouter } from 'next/navigation'

export default function ManageCompanies() {
  const { user } = useAuth()
  const router = useRouter()
  const [filteredCompany, setfilteredCompany] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [dailyLimitFilter, setDailyLimitFilter] = useState<string>('all')
  const [singleLimitFilter, setSingleLimitFilter] = useState<string>('all')
  const [rcnTinFilter, setRcnTinFilter] = useState<string>('all')

  const { companies, isLoading, deleteCompany } = useCompany()

  // Helper function: Date filtering logic
  const checkDateRange = (createdAt: string | undefined, filter: string) => {
    if (!createdAt || filter === 'all') return true

    const date = new Date(createdAt)
    const now = new Date()

    if (filter === 'today') {
      return date.toDateString() === now.toDateString()
    }

    if (filter === 'week') {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(now.getDate() - 7)
      return date >= oneWeekAgo
    }

    if (filter === 'month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }

    return true
  }

  useEffect(() => {
    const list: Company[] = Array.isArray(companies) ? companies : []

    let filtered = list.filter((comp) => {
      const search = searchTerm.toLowerCase()

      const matchesSearch =
        searchTerm === '' ||
        comp.name?.toLowerCase().includes(search) ||
        comp.email?.toLowerCase().includes(search) ||
        comp.phone?.toLowerCase().includes(search) ||
        comp.address?.toLowerCase().includes(search)

      const matchesDate = checkDateRange(comp.created_at, dateFilter)

      const matchesDailyLimit =
        dailyLimitFilter === 'all'
          ? true
          : dailyLimitFilter === 'low'
            ? (parseInt(comp.daily_transfer_limit) ?? 0) < 100000
            : dailyLimitFilter === 'mid'
              ? (parseInt(comp.daily_transfer_limit) ?? 0) >= 100000 &&
                (parseInt(comp.daily_transfer_limit) ?? 0) <= 500000
              : (parseInt(comp.daily_transfer_limit) ?? 0) > 500000

      const matchesSingleLimit =
        singleLimitFilter === 'all'
          ? true
          : singleLimitFilter === 'low'
            ? (parseInt(comp.single_transfer_limit) ?? 0) < 10000
            : singleLimitFilter === 'mid'
              ? (parseInt(comp.single_transfer_limit) ?? 0) >= 10000 &&
                (parseInt(comp.single_transfer_limit) ?? 0) <= 50000
              : (parseInt(comp.single_transfer_limit) ?? 0) > 50000

      const matchesRcnTin =
        rcnTinFilter === 'all'
          ? true
          : rcnTinFilter === 'has_rcn'
            ? !!comp.rcn
            : rcnTinFilter === 'no_rcn'
              ? !comp.rcn
              : rcnTinFilter === 'has_tin'
                ? !!comp.tin
                : !comp.tin

      return (
        matchesSearch &&
        matchesDate &&
        matchesDailyLimit &&
        matchesSingleLimit &&
        matchesRcnTin
      )
    })

    setfilteredCompany(filtered)
  }, [companies, searchTerm, dateFilter, dailyLimitFilter, singleLimitFilter, rcnTinFilter])

  const handleCompanyAction = async (action: string, companyId?: string | number) => {
    if (!companyId) return
    try {
      if (action === 'delete') {
        await deleteCompany(String(companyId))
      }
    } catch (err) {
      // Company action failed - error already handled by mutation
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Companies</h1>
        {user?.role === 'admin1' && (
          <Button onClick={() => router.push('/admin/dashboard/clients/onboard')}>
            Add Company
          </Button>
        )}
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="flex justify-between flex-col md:flex-row gap-4 py-4">

          {/* Search */}
          <div>
            <label>Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, phone, address"
                className="pl-10"
              />
            </div>
          </div>

          {/* Daily Limit Filter */}
          <div>
            <label>Daily Transfer</label>
            <Select value={dailyLimitFilter} onValueChange={setDailyLimitFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Below 100k</SelectItem>
                <SelectItem value="mid">100k - 500k</SelectItem>
                <SelectItem value="high">Above 500k</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Single Limit Filter */}
          <div>
            <label>Single Transfer</label>
            <Select value={singleLimitFilter} onValueChange={setSingleLimitFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Below 10k</SelectItem>
                <SelectItem value="mid">10k - 50k</SelectItem>
                <SelectItem value="high">Above 50k</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RCN/TIN Filter */}
          <div>
            <label>RCN / TIN</label>
            <Select value={rcnTinFilter} onValueChange={setRcnTinFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="has_rcn">Has RCN</SelectItem>
                <SelectItem value="no_rcn">No RCN</SelectItem>
                <SelectItem value="has_tin">Has TIN</SelectItem>
                <SelectItem value="no_tin">No TIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
      </Card>



      {/* Date Filter Buttons */}
     {/* Date Filter Buttons */}
<div className="flex gap-2 mb-4">
  {['All', 'Today', 'This Week', 'This Month'].map((label) => (
    <Button
      key={label}
      variant={dateFilter === label.toLowerCase() ? 'default' : 'outline'}
      size="sm"
      onClick={() => setDateFilter(label.toLowerCase())}
    >
      {label}
    </Button>
  ))}
</div>


      {/* TABLE */}
      <Card className='px-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              {/* <TableHead>Address</TableHead> */}
              {/* <TableHead>RCN</TableHead>
              <TableHead>TIN</TableHead> */}
              <TableHead>Account No</TableHead>
              <TableHead>Daily Limit</TableHead>
              <TableHead>Single Limit</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-32 rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              filteredCompany.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.name ?? '—'}</TableCell>
                  <TableCell>{company.email ?? '—'}</TableCell>
                  <TableCell>{company.phone ?? '—'}</TableCell>
                  {/* <TableCell>{company.address ?? '—'}</TableCell>
                  <TableCell>{company.rcn ?? '—'}</TableCell>
                  <TableCell>{company.tin ?? '—'}</TableCell> */}
                  <TableCell>{company.account_no ?? '—'}</TableCell>
                  <TableCell>{company.daily_transfer_limit?.toLocaleString() ?? '—'}</TableCell>
                  <TableCell>{company.single_transfer_limit?.toLocaleString() ?? '—'}</TableCell>
                  <TableCell>{company.created_at ? new Date(company.created_at).toLocaleDateString() : '—'}</TableCell>

                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/admin/dashboard/clients/${company.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompanyAction('delete', company.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {filteredCompany.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Building2 className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No companies found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>
    </div>
  )
}
