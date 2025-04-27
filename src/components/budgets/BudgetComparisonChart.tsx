
import React, { useMemo } from 'react';
import { BudgetComparison } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/mockData';

interface BudgetComparisonChartProps {
  data: BudgetComparison[];
}

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      category: item.category,
      budgeted: item.budgeted,
      spent: item.spent,
      percentage: item.percentage
    }));
  }, [data]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 rounded-lg shadow-md border">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-primary">{`Budget: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-sm text-muted-foreground">{`Spent: ${formatCurrency(payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Budget vs. Spending</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground">No budget data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Budget vs. Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
              barGap={0}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="budgeted" name="Budget" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Actual" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
