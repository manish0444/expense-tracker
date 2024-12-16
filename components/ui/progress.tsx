"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className, indicatorClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full bg-muted/50 rounded-full h-2", className)} ref={ref} {...props}>
        <div
          className={cn(
            "absolute left-0 top-0 h-2 rounded-full transition-all",
            indicatorClassName
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
