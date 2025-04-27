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

// Initial mock transactions with Indian context
export const initialTransactions: Transaction[] = [
  {
    id: generateId(),
    amount: -2500,
    date: subDays(new Date(), 1),
    description: "Grocery Shopping",
    category: "Food",
  },
  {
    id: generateId(),
    amount: -1000,
    date: subDays(new Date(), 2),
    description: "Metro Card Recharge",
    category: "Transport",
  },
  {
    id: generateId(),
    amount: -1500,
    date: subDays(new Date(), 3),
    description: "Movie Night",
    category: "Entertainment",
  },
  {
    id: generateId(),
    amount: -3500,
    date: subDays(new Date(), 4),
    description: "Electricity Bill",
    category: "Bills",
  },
  {
    id: generateId(),
    amount: -25000,
    date: subDays(new Date(), 5),
    description: "Monthly Rent",
    category: "Housing",
  },
  {
    id: generateId(),
    amount: 250000,
    date: subDays(new Date(), 5),
    description: "Monthly Salary",
    category: "Income",
  },
  {
    id: generateId(),
    amount: -2999,
    date: subDays(new Date(), 6),
    description: "New Shirt",
    category: "Shopping",
  },
  {
    id: generateId(),
    amount: -1200,
    date: subDays(new Date(), 7),
    description: "Doctor Visit",
    category: "Health",
  }
];

// Initial monthly budget allocation (in Indian Rupees)
export const initialBudgets: CategoryBudget[] = [
  { category: "Food", amount: 15000 },
  { category: "Transport", amount: 5000 },
  { category: "Entertainment", amount: 8000 },
  { category: "Bills", amount: 12000 },
  { category: "Housing", amount: 30000 },
  { category: "Shopping", amount: 10000 },
  { category: "Health", amount: 5000 },
  { category: "Others", amount: 5000 }
];

// Format currency to Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0 // Remove decimal places for INR
  }).format(amount);
};

// Format date
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};
