import React from 'react'
import { Plus, Download } from "lucide-react"
import { Button } from '@/components/ui/button'
import Link from "next/link"

export default function Welcome({ user }: { user: { name: string; company: string; role: string } }) {
  return (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]}!</h2>
                <p className="text-muted-foreground">{user.company} • {user.role}</p>
              </div>
              <div className="flex gap-3">
                <Link href="/customer/transactions/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Payment
                  </Button>
                </Link>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
  )
}
