import React from 'react';
import { cn } from '../utils';
import { CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'verified' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-200 text-gray-700',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    verified: 'bg-emerald-100 text-emerald-800'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const getIcon = () => {
    switch (variant) {
      case 'verified':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'danger':
        return <X className="h-3 w-3 mr-1" />;
      case 'info':
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {getIcon()}
      {children}
    </span>
  );
};