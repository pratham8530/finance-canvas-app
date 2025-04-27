
import React, { useMemo } from 'react';
import { Transaction, Category } from '@/types';
import { getCategoryColor } from '@/utils/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CategoryChartProps {
  transactions: Transaction[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  // Prepare data for pie chart - only consider expenses (negative amounts)
  const chartData: ChartData[] = useMemo(() => {
    // Create object to track spending by category
    const categorySpending: Record<Category, number> = {} as Record<Category, number>;
    
    // Sum up expenses by category (only negative amounts)
    transactions
      .filter(transaction => transaction.amount < 0)
      .forEach(transaction => {
        const category = transaction.category;
        const absAmount = Math.abs(transaction.amount);
        
        if (categorySpending[category]) {
          categorySpending[category] += absAmount;
        } else {
          categorySpending[category] = absAmount;
        }
      });
    
    // Convert to array format for chart
    return Object.entries(categorySpending)
      .map(([category, amount]) => ({
        name: category,
        value: Number(amount.toFixed(2)),
        color: getCategoryColor(category as Category),
      }))
      .filter(item => item.value > 0); // Only include categories with expenses
  }, [transactions]);
  
  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 rounded-lg shadow-md border">
          <p className="font-medium">{`${data.name}`}</p>
          <p className="text-sm text-muted-foreground">{`$${data.value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
