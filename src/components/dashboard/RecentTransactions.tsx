
import React from 'react';
import { formatCurrency, formatDate } from '@/utils/mockData';
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, 5);
  
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between pb-3 border-b">
                <div className="flex flex-col">
                  <span className="font-medium">{transaction.description}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={transaction.amount > 0 ? "outline" : "default"}>
                    {transaction.category}
                  </Badge>
                  <span className={transaction.amount > 0 ? "text-green-600 font-medium" : "font-medium"}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
