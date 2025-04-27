
import React, { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categories, getCategoryColor, formatCurrency } from '@/utils/mockData';
import { Category } from '@/types';

const CategoriesPage = () => {
  const { transactions } = useFinance();

  // Calculate spending by category for current month
  const categoriesData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Get transactions for current month
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
    
    // Group expenses by category
    const expensesByCategory: Record<Category, number> = {} as Record<Category, number>;
    
    currentMonthTransactions
      .filter(t => t.amount < 0)
      .forEach(transaction => {
        const category = transaction.category;
        const absAmount = Math.abs(transaction.amount);
        
        if (expensesByCategory[category]) {
          expensesByCategory[category] += absAmount;
        } else {
          expensesByCategory[category] = absAmount;
        }
      });
    
    // Calculate total expenses
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
    
    // Create category stats with percentages
    return categories.map(category => {
      const amount = expensesByCategory[category.name] || 0;
      const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
      
      return {
        name: category.name,
        color: category.color,
        amount,
        percentage
      };
    })
    .filter(cat => cat.amount > 0) // Only include categories with expenses
    .sort((a, b) => b.amount - a.amount); // Sort by amount (highest first)
  }, [transactions]);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Analyze your spending by category
          </p>
        </div>

        {/* Spending by category visualization */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <CategoryChart transactions={transactions} />
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categoriesData.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span>{formatCurrency(category.amount)}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${category.percentage}%`,
                            backgroundColor: category.color 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {category.percentage}% of total expenses
                      </div>
                    </div>
                  ))}

                  {categoriesData.length === 0 && (
                    <div className="flex justify-center items-center py-8">
                      <p className="text-muted-foreground">No expense data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category descriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Categories Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div 
                  key={category.name}
                  className="flex items-center p-3 rounded-lg border"
                >
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {getCategoryDescription(category.name)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// Helper function to get category descriptions
function getCategoryDescription(category: Category): string {
  switch (category) {
    case 'Food':
      return 'Groceries, restaurants, take-out and delivery';
    case 'Transport':
      return 'Public transportation, fuel, parking, car maintenance';
    case 'Entertainment':
      return 'Movies, concerts, subscriptions, hobbies';
    case 'Bills':
      return 'Utilities, phone bills, internet, insurance';
    case 'Housing':
      return 'Rent, mortgage, property taxes, repairs';
    case 'Shopping':
      return 'Clothing, electronics, home goods';
    case 'Health':
      return 'Medical expenses, prescriptions, fitness';
    case 'Income':
      return 'Salary, freelance work, investments';
    case 'Others':
      return 'Miscellaneous expenses and uncategorized items';
    default:
      return '';
  }
}

export default CategoriesPage;
