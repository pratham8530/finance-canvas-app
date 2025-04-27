
import React, { createContext, useContext, useState, useMemo } from 'react';
import { Transaction, Category, CategoryBudget, MonthlySpending, CategorySpending } from '@/types';
import { initialTransactions, initialBudgets, generateId } from '@/utils/mockData';
import { startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: CategoryBudget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: Category, amount: number) => void;
  getCurrentMonthExpenses: () => number;
  getCurrentMonthIncome: () => number;
  getCategorySpending: (period?: 'month' | 'year') => CategorySpending[];
  getMonthlySpending: (months: number) => MonthlySpending[];
  getBudgetProgress: () => { total: { budgeted: number; spent: number; percentage: number }, categories: Record<Category, { budgeted: number; spent: number; percentage: number }> };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(initialBudgets);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { 
      ...transaction, 
      id: generateId() 
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const updateBudget = (category: Category, amount: number) => {
    setBudgets(
      budgets.map((budget) =>
        budget.category === category ? { ...budget, amount } : budget
      )
    );
  };

  // Get current month's expenses
  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    return transactions
      .filter(t => 
        t.amount < 0 && 
        isWithinInterval(new Date(t.date), { start, end })
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  // Get current month's income
  const getCurrentMonthIncome = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    return transactions
      .filter(t => 
        t.amount > 0 && 
        isWithinInterval(new Date(t.date), { start, end })
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get spending by category
  const getCategorySpending = (period: 'month' | 'year' = 'month') => {
    const now = new Date();
    let start: Date, end: Date;
    
    if (period === 'month') {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    }
    
    const categorySpending: Record<Category, number> = {} as Record<Category, number>;
    
    transactions
      .filter(t => 
        t.amount < 0 && 
        isWithinInterval(new Date(t.date), { start, end })
      )
      .forEach(t => {
        const absAmount = Math.abs(t.amount);
        categorySpending[t.category] = (categorySpending[t.category] || 0) + absAmount;
      });
    
    return Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category: category as Category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Get monthly spending for the last X months
  const getMonthlySpending = (months: number = 6) => {
    const result: MonthlySpending[] = [];
    const now = new Date();
    
    for (let i = 0; i < months; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      
      const amount = transactions
        .filter(t => 
          t.amount < 0 && 
          isWithinInterval(new Date(t.date), { start, end })
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      result.push({
        month: format(monthDate, 'MMM yyyy'),
        amount
      });
    }
    
    return result.reverse();
  };

  // Get budget progress
  const getBudgetProgress = () => {
    const categorySpending = getCategorySpending('month');
    const spendingMap: Record<Category, number> = {};
    categorySpending.forEach(cs => {
      spendingMap[cs.category] = cs.amount;
    });
    
    let totalBudgeted = 0;
    let totalSpent = 0;
    const categories: Record<Category, { budgeted: number; spent: number; percentage: number }> = {} as Record<Category, any>;
    
    budgets.forEach(budget => {
      const spent = spendingMap[budget.category] || 0;
      const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
      
      if (budget.category !== 'Income') {
        totalBudgeted += budget.amount;
        totalSpent += spent;
      }
      
      categories[budget.category] = {
        budgeted: budget.amount,
        spent,
        percentage
      };
    });
    
    return {
      total: {
        budgeted: totalBudgeted,
        spent: totalSpent,
        percentage: totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0
      },
      categories
    };
  };

  const contextValue = useMemo(() => ({
    transactions,
    budgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    getCurrentMonthExpenses,
    getCurrentMonthIncome,
    getCategorySpending,
    getMonthlySpending,
    getBudgetProgress
  }), [transactions, budgets]);

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
