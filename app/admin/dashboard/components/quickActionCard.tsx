import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, Activity, Users } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"

const allQuickActions = [
  { href: "/customer/transactions/create", icon: Plus, label: "New Payment", roles: ["maker"] },
  { href: "/customer/transactions/approve", icon: CheckCircle2, label: "Approve", roles: ["authorizer"] },
  { href: "/customer/transactions/history", icon: Activity, label: "History", roles: ["maker", "authorizer"] },
  { href: "/customer/dashboard/profile", icon: Users, label: "Profile", roles: ["maker", "authorizer"] },
]

export default function QuickActionsCard() {
  const { profile } = useAuth()

  // Filter actions based on user role
  const quickActions = allQuickActions.filter(action =>
    action.roles.includes(profile?.role || "")
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Icon className="w-6 h-6 mb-2" />
                  <span>{action.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
