
import React, { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatisticCard } from '@/components/dashboard/StatisticCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { MonthlyExpensesChart } from '@/components/dashboard/MonthlyExpensesChart';
import { BudgetProgressList } from '@/components/budgets/BudgetProgressList';
import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/utils/mockData';
import { BudgetComparison, Category } from '@/types';
import { ArrowDown, ArrowUp, BarChart, PieChart, Wallet } from 'lucide-react';

const Index = () => {
  const { transactions, budgets } = useFinance();

  // Calculate total expenses for current month
  const totalExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          t.amount < 0
        );
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  }, [transactions]);

  // Calculate total income for current month
  const totalIncome = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          t.amount > 0
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);

  // Calculate month-over-month change in expenses
  const expenseTrend = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    
    // Current month expenses
    const currentExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          t.amount < 0
        );
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    
    // Previous month expenses
    const prevExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === prevMonth &&
          transactionDate.getFullYear() === prevYear &&
          t.amount < 0
        );
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    
    if (prevExpenses === 0) return { value: "New month", positive: false };
    
    const percentChange = ((currentExpenses - prevExpenses) / prevExpenses) * 100;
    
    return {
      value: `${Math.abs(percentChange).toFixed(1)}%`,
      positive: percentChange <= 0 // Spending less is positive
    };
  }, [transactions]);

  // Get budget comparison data for top categories
  const budgetComparisonData: BudgetComparison[] = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Create spending by category for current month
    const categorySpending: Record<Category, number> = {} as Record<Category, number>;
    
    transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          t.amount < 0
        );
      })
      .forEach(transaction => {
        const category = transaction.category;
        const absAmount = Math.abs(transaction.amount);
        
        if (categorySpending[category]) {
          categorySpending[category] += absAmount;
        } else {
          categorySpending[category] = absAmount;
        }
      });
      
    // Compare with budgets
    return budgets
      .filter(budget => budget.category !== 'Income')
      .map(budget => {
        const spent = categorySpending[budget.category] || 0;
        const percentage = budget.amount > 0 
          ? Math.round((spent / budget.amount) * 100) 
          : 0;
        
        return {
          category: budget.category,
          budgeted: budget.amount,
          spent: spent,
          percentage: percentage
        };
      })
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage (highest first)
      .slice(0, 5); // Take top 5
  }, [transactions, budgets]);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your financial overview and summary
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatisticCard
            title="Monthly Expenses"
            value={formatCurrency(totalExpenses)}
            icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
            trend={expenseTrend}
            className="border-l-4 border-l-red-400"
          />
          <StatisticCard
            title="Monthly Income"
            value={formatCurrency(totalIncome)}
            icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
            className="border-l-4 border-l-green-400"
          />
          <StatisticCard
            title="Net Balance"
            value={formatCurrency(totalIncome - totalExpenses)}
            trend={{ 
              value: totalIncome - totalExpenses > 0 ? 'Positive' : 'Negative', 
              positive: totalIncome - totalExpenses > 0 
            }}
            icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
            className={`border-l-4 ${
              totalIncome - totalExpenses >= 0 
                ? 'border-l-green-400' 
                : 'border-l-red-400'
            }`}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <MonthlyExpensesChart transactions={transactions} />
          <CategoryChart transactions={transactions} />
        </div>

        {/* Budget progress and recent transactions */}
        <div className="grid gap-4 md:grid-cols-2">
          <BudgetProgressList data={budgetComparisonData} />
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
