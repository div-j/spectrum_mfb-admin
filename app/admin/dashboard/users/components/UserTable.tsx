import React from 'react'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Calendar, Building2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import UserRow from './UserRow'
import { UserResponse } from '@/lib/interface'

type Props = {
  users: Partial<UserResponse>[]
  isLoading?: boolean
  onAction: (action: string, id?: string | number) => void
}

export default function UserTable({ users, isLoading, onAction }: Props) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Activated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
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
                  <Skeleton className="h-4 w-16 rounded" />
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
          ) : (
            users.map((u) => <UserRow key={u.id ?? u.email} user={u} onAction={onAction} />)
          )}
        </TableBody>
      </Table>
    </>
  )
}
