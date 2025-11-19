import { Badge } from '@/components/ui/badge'
import React from 'react'

  export const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      failed: "bg-red-100 text-red-700 border-red-200",
      pending_review: "bg-blue-100 text-blue-700 border-blue-200",
      pending_approval: "bg-orange-100 text-orange-700 border-orange-200"
    }
    
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }