
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart, PieChart, Home, Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function SideNavigation() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    {
      name: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      href: '/',
    },
    {
      name: 'Transactions',
      icon: <Wallet className="w-5 h-5" />,
      href: '/transactions',
    },
    {
      name: 'Budgets',
      icon: <BarChart className="w-5 h-5" />,
      href: '/budgets',
    },
    {
      name: 'Categories',
      icon: <PieChart className="w-5 h-5" />,
      href: '/categories',
    },
  ];

  if (isMobile) {
    return (
      <div className="flex justify-center py-4 mb-4 border-b">
        <nav className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="border-r w-64 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8 tracking-tight">Finance Visualizer</h1>
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
