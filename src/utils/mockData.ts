
import { Transaction, Category, CategoryBudget } from "@/types";
import { format, subDays } from "date-fns";

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Initial categories with colors
export const categories: { name: Category; color: string }[] = [
  { name: "Food", color: "#8B5CF6" },
  { name: "Transport", color: "#10B981" },
  { name: "Entertainment", color: "#F59E0B" },
  { name: "Bills", color: "#EF4444" },
  { name: "Housing", color: "#6366F1" },
  { name: "Shopping", color: "#EC4899" },
  { name: "Health", color: "#14B8A6" },
  { name: "Income", color: "#22C55E" },
  { name: "Others", color: "#9CA3AF" }
];

// Get color for a specific category
export const getCategoryColor = (category: Category): string => {
  return categories.find(c => c.name === category)?.color || "#9CA3AF";
};

// Initial mock transactions
export const initialTransactions: Transaction[] = [
  {
    id: generateId(),
    amount: -45.99,
    date: subDays(new Date(), 1),
    description: "Grocery Shopping",
    category: "Food",
  },
  {
    id: generateId(),
    amount: -12.50,
    date: subDays(new Date(), 2),
    description: "Bus Pass",
    category: "Transport",
  },
  {
    id: generateId(),
    amount: -25.00,
    date: subDays(new Date(), 3),
    description: "Movie Tickets",
    category: "Entertainment",
  },
  {
    id: generateId(),
    amount: -85.50,
    date: subDays(new Date(), 4),
    description: "Electric Bill",
    category: "Bills",
  },
  {
    id: generateId(),
    amount: -950.00,
    date: subDays(new Date(), 5),
    description: "Monthly Rent",
    category: "Housing",
  },
  {
    id: generateId(),
    amount: 1750.00,
    date: subDays(new Date(), 5),
    description: "Salary",
    category: "Income",
  },
  {
    id: generateId(),
    amount: -34.99,
    date: subDays(new Date(), 6),
    description: "T-shirt",
    category: "Shopping",
  },
  {
    id: generateId(),
    amount: -65.00,
    date: subDays(new Date(), 7),
    description: "Doctor Visit",
    category: "Health",
  }
];

// Initial monthly budget allocation
export const initialBudgets: CategoryBudget[] = [
  { category: "Food", amount: 300 },
  { category: "Transport", amount: 150 },
  { category: "Entertainment", amount: 200 },
  { category: "Bills", amount: 350 },
  { category: "Housing", amount: 1200 },
  { category: "Shopping", amount: 150 },
  { category: "Health", amount: 100 },
  { category: "Others", amount: 100 }
];

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format date
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};
