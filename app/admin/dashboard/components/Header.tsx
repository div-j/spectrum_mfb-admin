import React from 'react'
import { Bell, Menu } from "lucide-react"
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMenuToggle}
              className="lg:hidden p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg sm:text-xl font-semibold truncate">Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
