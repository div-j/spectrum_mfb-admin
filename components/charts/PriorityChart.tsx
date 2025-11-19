'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, TrendingDown } from "lucide-react"

interface PriorityChartProps {
  data: Array<{
    id: string
    amount: number
    priority: 'low' | 'medium' | 'high'
    status: string
  }>
}

export function PriorityChart({ data }: PriorityChartProps) {
  const priorityData = [
    { 
      priority: 'Low', 
      count: data.filter(t => t.priority === 'low').length, 
      color: '#10b981',
      icon: TrendingDown,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    { 
      priority: 'Medium', 
      count: data.filter(t => t.priority === 'medium').length, 
      color: '#f59e0b',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    { 
      priority: 'High', 
      count: data.filter(t => t.priority === 'high').length, 
      color: '#ef4444',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ]

  const totalTransactions = data.length
  const maxCount = Math.max(...priorityData.map(d => d.count))

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        count: number;
        priority: string;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = totalTransactions > 0 ? ((data.count / totalTransactions) * 100).toFixed(1) : '0'
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{`${label} Priority`}</p>
          <p className="text-sm">
            <span className="font-medium">{data.count}</span> transactions ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

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
        <div className="flex gap-2 mb-4 flex-wrap">
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

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="priority" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={[0, maxCount + 1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            >
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t">
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