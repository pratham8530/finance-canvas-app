
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatisticCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatisticCard({ title, value, icon, trend, className }: StatisticCardProps) {
  return (
    <Card className={cn("stats-card overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {trend && (
              <p className={cn(
                "text-xs mt-1",
                trend.positive ? "text-green-500" : "text-red-500"
              )}>
                {trend.positive ? "+" : ""}{trend.value}
              </p>
            )}
          </div>
          {icon && (
            <div className="rounded-full bg-secondary p-3">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
