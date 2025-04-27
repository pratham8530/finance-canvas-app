
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

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
              <div className={cn(
                "flex items-center text-xs mt-1 space-x-1",
                trend.positive ? "text-green-500" : "text-red-500"
              )}>
                {trend.positive ? 
                  <ArrowDown className="h-3 w-3" /> : 
                  <ArrowUp className="h-3 w-3" />
                }
                <span>{trend.value}</span>
              </div>
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
