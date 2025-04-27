
import React from 'react';
import { BudgetComparison } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/mockData';

interface BudgetProgressListProps {
  data: BudgetComparison[];
}

export function BudgetProgressList({ data }: BudgetProgressListProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <p className="text-muted-foreground">No budget data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{item.category}</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(item.spent)} of {formatCurrency(item.budgeted)}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Progress value={Math.min(item.percentage, 100)} className="h-2" />
                <span className={`text-xs font-medium ${
                  item.percentage > 100 ? 'text-destructive' : 
                  item.percentage > 80 ? 'text-amber-500' : 
                  'text-primary'
                }`}>
                  {item.percentage}%
                </span>
              </div>
              {item.percentage > 100 && (
                <p className="text-xs text-destructive">
                  You've exceeded your budget by {formatCurrency(item.spent - item.budgeted)}
                </p>
              )}
              {item.percentage > 80 && item.percentage <= 100 && (
                <p className="text-xs text-amber-500">
                  You've used {item.percentage}% of your budget
                </p>
              )}
              {item.percentage <= 80 && (
                <p className="text-xs text-primary">
                  You're on track with your budget
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
