import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from '@/components/ui/table'
import { Building2, Eye, Edit, Trash2 } from 'lucide-react'
import { UserResponse } from '@/lib/interface'
import { useRouter } from 'next/navigation'
import { getRoleBadge } from '../../components/getBadge'

type Props = {
  user: Partial<UserResponse>
  onAction: (action: string, id?: string | number) => void
}

const getUserInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase()
const getRole = (user: Partial<UserResponse>) => (user.roles?.[0] ?? user.role ?? '') as string

export default function UserRow({ user, onAction }: Props) {
  const router = useRouter()
  return (
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
      <TableCell>{getRoleBadge(user?.roles?.[0]||'')}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          {user.company_name ?? '—'}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">{user.phone_number ?? '—'}</div>
      </TableCell>
      <TableCell>
        {/* <Badge 
          variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'}
          className={user.status === 'active' ? 'bg-green-100 text-green-700' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
        >
          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ''}
        </Badge> */}
        {getRoleBadge(user?.status)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{user.activated ? 'Yes' : 'No'}</TableCell>
      <TableCell className="text-right flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/dashboard/users/${user.id}`)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction('delete', user.id ?? '')} className="text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
