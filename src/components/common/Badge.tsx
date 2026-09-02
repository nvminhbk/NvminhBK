import React from 'react';
import { GradeLevel } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
  dot = false
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  };

  const dotColors = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const GradeBadge: React.FC<{ grade: GradeLevel; size?: 'sm' | 'md' | 'lg' }> = ({ grade, size = 'md' }) => {
  if (grade === 10) {
    return <Badge variant="blue" size={size}>Khối 10</Badge>;
  }
  if (grade === 11) {
    return <Badge variant="indigo" size={size}>Khối 11</Badge>;
  }
  return <Badge variant="purple" size={size}>Khối 12</Badge>;
};
