import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


 export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

 export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    })
  }



  export const getPriorityColor = (priority: string) => {
    const colors = {
      high: "text-red-600",
      medium: "text-yellow-600", 
      low: "text-green-600"
    }
    return colors[priority as keyof typeof colors] || "text-gray-600"
  }