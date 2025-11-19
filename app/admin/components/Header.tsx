import React from 'react'
import { ArrowLeft, Building2 } from "lucide-react"
import Link from "next/link"



export default function Header({title, description }: {title:string, description:string }) {
  return (
    <div>
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-[95%] mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/dashboard"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{title}</h1>
            </div>  
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Spectrum MFB</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
