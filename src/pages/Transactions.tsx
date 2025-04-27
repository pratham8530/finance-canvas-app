
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction } from '@/types';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const TransactionsPage = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string>('date-desc');
  const [viewType, setViewType] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  
  // Handler for opening the form dialog
  const handleOpenForm = (transaction?: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  // Handler for form submission
  const handleSubmitForm = (data: Omit<Transaction, 'id'>) => {
    if (selectedTransaction) {
      updateTransaction({
        ...data,
        id: selectedTransaction.id,
      });
      toast({
        title: "Transaction updated",
        description: "Your transaction has been updated successfully."
      });
    } else {
      addTransaction(data);
      toast({
        title: "Transaction added",
        description: "Your transaction has been added successfully."
      });
    }
    setIsDialogOpen(false);
    setSelectedTransaction(undefined);
  };

  // Handler for deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been deleted successfully.",
      variant: "destructive"
    });
  };

  // Filter transactions based on time period
  const filteredByTime = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const today = new Date();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    switch (timeFilter) {
      case "today":
        return format(transactionDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      case "thisMonth":
        return transactionDate.getMonth() === thisMonth && 
               transactionDate.getFullYear() === thisYear;
      case "thisYear":
        return transactionDate.getFullYear() === thisYear;
      default:
        return true;
    }
  });

  // Filter transactions based on type (income/expense)
  const filteredTransactions = filteredByTime.filter(transaction => {
    switch (viewType) {
      case "income":
        return transaction.amount > 0;
      case "expenses":
        return transaction.amount < 0;
      default:
        return true;
    }
  });

  // Sort transactions based on selected option
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortOption) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              Manage and view your financial transactions
            </p>
          </div>
          <div>
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Filtering options */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
            <Tabs 
              defaultValue="all" 
              value={viewType}
              onValueChange={setViewType}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select
              value={timeFilter}
              onValueChange={setTimeFilter}
              defaultValue="all"
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="thisYear">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Select
            value={sortOption}
            onValueChange={setSortOption}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest first</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
              <SelectItem value="amount-desc">Highest amount</SelectItem>
              <SelectItem value="amount-asc">Lowest amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TransactionsTable 
          transactions={sortedTransactions}
          onEdit={handleOpenForm}
          onDelete={handleDeleteTransaction}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </DialogTitle>
            </DialogHeader>
            <TransactionForm
              onSubmit={handleSubmitForm}
              defaultValues={selectedTransaction}
              isEdit={!!selectedTransaction}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TransactionsPage;
