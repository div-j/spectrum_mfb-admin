import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import React from 'react'
import { getStatusBadge } from './getStatusbadge'
import { Transaction } from '@/types/index'

interface TransactionCardProps {
  data: Transaction
}

export default function TransactionCard({data}: TransactionCardProps) {
  return (
      <div key={data.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        data.type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {data.type === 'incoming' ? 
                          <ArrowDownRight className="w-5 h-5 text-green-600" /> : 
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-sm">{data.recipient}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(data.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        data.type === 'incoming' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.type === 'incoming' ? '+' : '-'}{formatCurrency(data.amount)}
                      </p>
                      {getStatusBadge(data.status)}
                    </div>
                  </div>
  )
}
