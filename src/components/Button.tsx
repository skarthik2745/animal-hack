import React from 'react';
import { cn } from '../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500',
    secondary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500',
    outline: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:from-red-600 hover:to-red-700 focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};