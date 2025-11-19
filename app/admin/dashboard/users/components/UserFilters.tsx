import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

type Props = {
  searchTerm: string
  setSearchTerm: (v: string) => void
  roleFilter: string
  setRoleFilter: (v: string) => void
  onReset?: () => void
}

export default function UserFilters({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, onReset }: Props) {
  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label>Search Users</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, email, company..." className="pl-10" />
          </div>
        </div>

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

        <div className="flex items-end md:col-span-2">
          <Button variant="outline" className="w-full" onClick={() => onReset ? onReset() : (setSearchTerm(''), setRoleFilter('all'))}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
