import React from 'react';

export const RubElHizb = ({ 
  children, 
  className = "w-10 h-10", 
  starClassName = "text-primary/15 dark:text-primary/25",
  borderClassName = "stroke-primary/40",
  textClassName = "text-xs font-semibold text-primary",
  size = 36 
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 36 36"
        className={`absolute inset-0 w-full h-full transition-transform duration-300 group-hover:rotate-45 ${starClassName}`}
      >
        {/* Square 1 */}
        <rect
          x="6"
          y="6"
          width="24"
          height="24"
          rx="3"
          fill="currentColor"
          className={borderClassName}
          strokeWidth="1"
        />
        {/* Square 2 rotated 45 deg */}
        <rect
          x="6"
          y="6"
          width="24"
          height="24"
          rx="3"
          transform="rotate(45 18 18)"
          fill="currentColor"
          className={borderClassName}
          strokeWidth="1"
        />
        {/* Inner circle */}
        <circle cx="18" cy="18" r="9" className="fill-base-100" />
      </svg>
      {children && (
        <span className={`relative z-10 select-none ${textClassName}`}>
          {children}
        </span>
      )}
    </div>
  );
};
