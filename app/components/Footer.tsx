import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"

export default function Footer() {
  return (
         <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Spectrum MFB</span>
            </div>
            <p className="text-gray-400 mb-6">Secure Corporate Banking Solutions</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2025 Spectrum Microfinance Bank</span>
              <span>•</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
  )
}
