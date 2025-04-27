
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, Category } from '@/types';
import { categories } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define schema for transaction form
const transactionSchema = z.object({
  amount: z.coerce.number()
    .refine(val => val !== 0, { message: "Amount cannot be zero" }),
  date: z.date({
    required_error: "Date is required",
  }),
  description: z.string()
    .min(3, { message: "Description must be at least 3 characters" })
    .max(50, { message: "Description must not exceed 50 characters" }),
  category: z.enum(categories.map(c => c.name) as [Category, ...Category[]]),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (values: TransactionFormValues) => void;
  defaultValues?: Partial<TransactionFormValues>;
  isEdit?: boolean;
}

export function TransactionForm({ onSubmit, defaultValues, isEdit = false }: TransactionFormProps) {
  // Create form
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      description: '',
      category: 'Others',
      ...defaultValues
    }
  });

  // Track if we're adding income or expense
  const [transactionType, setTransactionType] = React.useState<'income' | 'expense'>(
    defaultValues?.amount && defaultValues.amount > 0 ? 'income' : 'expense'
  );

  // Handle submit with correct amount sign
  const handleFormSubmit = (values: TransactionFormValues) => {
    // Convert amount to negative if it's an expense
    const amount = transactionType === 'expense' 
      ? -Math.abs(values.amount)
      : Math.abs(values.amount);
    
    onSubmit({
      ...values,
      amount
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Transaction type selector */}
        <Tabs
          defaultValue={transactionType}
          value={transactionType}
          onValueChange={(value) => setTransactionType(value as 'income' | 'expense')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
        </Tabs>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    placeholder="0.00" 
                    className="pl-8" 
                    {...field}
                    onChange={(e) => {
                      // Only allow numbers and decimal points
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      field.onChange(value);
                    }}
                    value={field.value === 0 ? '' : Math.abs(field.value)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="What was this for?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center">
                        <span 
                          className="w-2 h-2 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }} 
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isEdit ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </form>
    </Form>
  );
}
