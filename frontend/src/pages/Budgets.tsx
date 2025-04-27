
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BudgetForm } from '@/components/budgets/BudgetForm';
import { BudgetComparisonChart } from '@/components/budgets/BudgetComparisonChart';
import { BudgetProgressList } from '@/components/budgets/BudgetProgressList';
import { useFinance } from '@/contexts/FinanceContext';
import { Category, BudgetComparison } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/mockData';

const BudgetsPage = () => {
  const { transactions, budgets, updateBudget } = useFinance();

  // Calculate spending for each category in the current month
  const categorySpending = React.useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const spending: Record<Category, number> = {} as Record<Category, number>;
    
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
        
        if (spending[category]) {
          spending[category] += absAmount;
        } else {
          spending[category] = absAmount;
        }
      });
      
    return spending;
  }, [transactions]);

  // Generate budget comparison data
  const budgetComparisons: BudgetComparison[] = React.useMemo(() => {
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
      .sort((a, b) => b.percentage - a.percentage);
  }, [budgets, categorySpending]);

  // Calculate total budget and spending
  const totalBudgeted = budgets
    .filter(budget => budget.category !== 'Income')
    .reduce((total, budget) => total + budget.amount, 0);
    
  const totalSpent = Object.values(categorySpending).reduce((total, amount) => total + amount, 0);
  const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  // Handle budget update
  const handleBudgetUpdate = ({ category, amount }: { category: Category; amount: number }) => {
    updateBudget(category, amount);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Planning</h1>
          <p className="text-muted-foreground">
            Set and track your monthly budget goals
          </p>
        </div>

        {/* Overall budget status */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Budgeted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{overallPercentage}%</p>
              <p className={`text-sm ${
                overallPercentage > 100 ? 'text-destructive' : 
                overallPercentage > 80 ? 'text-amber-500' : 
                'text-primary'
              }`}>
                {overallPercentage > 100 ? 'Over budget' : 
                 overallPercentage > 80 ? 'Approaching limit' : 
                 'Within budget'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget comparison chart and form */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <BudgetComparisonChart data={budgetComparisons} />
          </div>
          <div>
            <BudgetForm onSubmit={handleBudgetUpdate} />
          </div>
        </div>

        {/* Budget progress list */}
        <BudgetProgressList data={budgetComparisons} />
      </div>
    </MainLayout>
  );
};

export default BudgetsPage;
