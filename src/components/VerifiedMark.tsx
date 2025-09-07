import React from 'react';
import { CheckCircle } from 'lucide-react';

interface VerifiedMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedMark: React.FC<VerifiedMarkProps> = ({ 
  size = 'sm', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3 sm:h-4 sm:w-4',
    md: 'h-4 w-4 sm:h-5 sm:w-5',
    lg: 'h-5 w-5 sm:h-6 sm:w-6'
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <CheckCircle 
        className={`${sizeClasses[size]} text-green-500`}
        fill="currentColor"
      />
    </div>
  );
};


