import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"

export default function MyHeader() {
  return (
    <div>
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Spectrum MFB</h1>
                <p className="text-sm text-gray-600">Corporate Banking Portal</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Secure Platform
            </Badge>
          </div>
        </div>
      </header>
    </div>
  )
}
