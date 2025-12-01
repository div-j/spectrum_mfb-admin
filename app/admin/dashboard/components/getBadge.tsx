import { Badge } from "@/components/ui/badge"

 

 export const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      authorizer: "bg-blue-100 text-blue-700 border-blue-200",
      maker: "bg-orange-100 text-orange-700 border-orange-200",
      initiator: "bg-green-100 text-green-700 border-green-200",
      reviewer: "bg-yellow-100 text-yellow-700 border-yellow-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
      active: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",

    }

    return (
      <Badge variant="outline" className={variants[role as keyof typeof variants]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }