'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, TrendingDown } from "lucide-react"

interface PriorityChartSimpleProps {
  data: Array<{
    id: string
    amount: number
    priority: 'low' | 'medium' | 'high'
    status: string
  }>
}

export function PriorityChartSimple({ data }: PriorityChartSimpleProps) {
  const priorityData = [
    { 
      priority: 'Low', 
      count: data.filter(t => t.priority === 'low').length, 
      color: 'bg-green-500',
      icon: TrendingDown,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    { 
      priority: 'Medium', 
      count: data.filter(t => t.priority === 'medium').length, 
      color: 'bg-yellow-500',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200'
    },
    { 
      priority: 'High', 
      count: data.filter(t => t.priority === 'high').length, 
      color: 'bg-red-500',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    }
  ]

  const totalTransactions = data.length
  const maxCount = Math.max(...priorityData.map(d => d.count))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          Priority Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Transaction breakdown by priority level
        </p>
      </CardHeader>
      <CardContent>
        {/* Priority Summary Badges */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {priorityData.map((item) => {
            const Icon = item.icon
            return (
              <Badge 
                key={item.priority} 
                variant="secondary" 
                className={`${item.bgColor} ${item.textColor} border-0`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {item.priority}: {item.count}
              </Badge>
            )
          })}
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          {priorityData.map((item) => {
            const Icon = item.icon
            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
            const displayPercentage = totalTransactions > 0 ? (item.count / totalTransactions) * 100 : 0
            
            return (
              <div key={item.priority} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${item.textColor}`} />
                    <span className="font-medium text-sm">{item.priority} Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.count}</span>
                    <span className="text-xs text-muted-foreground">
                      ({displayPercentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Transactions</p>
              <p className="font-semibold text-lg">{totalTransactions}</p>
            </div>
            <div>
              <p className="text-muted-foreground">High Priority</p>
              <p className="font-semibold text-lg text-red-600">
                {priorityData.find(p => p.priority === 'High')?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}