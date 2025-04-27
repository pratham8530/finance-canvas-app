
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction } from '@/types';
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
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const TransactionsPage = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string>('date-desc');

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
    } else {
      addTransaction(data);
    }
    setIsDialogOpen(false);
    setSelectedTransaction(undefined);
  };

  // Handler for deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
  };

  // Sort transactions based on selected option
  const sortedTransactions = [...transactions].sort((a, b) => {
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
          <div className="flex items-center gap-4">
            <Select
              value={sortOption}
              onValueChange={setSortOption}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest first</SelectItem>
                <SelectItem value="date-asc">Oldest first</SelectItem>
                <SelectItem value="amount-desc">Highest amount</SelectItem>
                <SelectItem value="amount-asc">Lowest amount</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
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
