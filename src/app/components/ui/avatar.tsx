import React from 'react';

interface AvatarProps {
  name: string;
  initials?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

export function Avatar({ name, initials, color = '#3b82f6', size = 'md', src }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const getInitials = () => {
    if (initials) return initials;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white shadow-sm`}>
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white shadow-sm`}
      style={{ backgroundColor: color }}
    >
      {getInitials()}
    </div>
  );
}
