
import React, { useMemo } from 'react';
import { Transaction } from '@/types';
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  // Generate data for current month's daily expenses
  const chartData = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    
    // Create array of all days in the month
    const daysInMonth = eachDayOfInterval({
      start: monthStart,
      end: monthEnd
    });
    
    // Initialize expense data for each day
    const dailyExpenses = daysInMonth.map(day => ({
      date: format(day, 'MMM dd'),
      expenses: 0,
      day: day
    }));
    
    // Calculate expenses for each day (only include negative amounts)
    transactions
      .filter(transaction => transaction.amount < 0)
      .forEach(transaction => {
        const index = dailyExpenses.findIndex(item => 
          isSameDay(item.day, transaction.date)
        );
        if (index !== -1) {
          dailyExpenses[index].expenses += Math.abs(transaction.amount);
        }
      });
    
    // Format and return the data
    return dailyExpenses.map(item => ({
      date: item.date,
      expenses: Number(item.expenses.toFixed(2))
    }));
  }, [transactions]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 rounded-lg shadow-md border">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-muted-foreground">{`$${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => value.split(' ')[1]}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="expenses" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
