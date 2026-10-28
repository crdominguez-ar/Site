import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = true,
  className = '',
}) => {
  const isDark = variant === 'dark';

  const emblemSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const titleSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-black',
  };

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Executive Geometric Monogram 'CD' Icon */}
      <div
        className={`${emblemSizes[size]} relative rounded-lg bg-gradient-to-br from-[#0078D4] via-[#005A9E] to-[#002447] p-[1.5px] shadow-sm flex items-center justify-center shrink-0 group-hover:shadow-md transition-shadow`}
      >
        <div className="w-full h-full rounded-[6px] bg-slate-950/20 backdrop-blur-xs flex items-center justify-center relative overflow-hidden">
          {/* Subtle architectural light reflection */}
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-white/20 rounded-full blur-xs pointer-events-none" />
          
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
          >
            {/* Geometric architectural monogram C + D */}
            <path
              d="M13 8C8.58172 8 5 11.5817 5 16C5 20.4183 8.58172 24 13 24H15V20.5H13C10.5147 20.5 8.5 18.4853 8.5 16C8.5 13.5147 10.5147 11.5 13 11.5H15V8H13Z"
              fill="currentColor"
            />
            <path
              d="M16 8H21C24.866 8 28 11.134 28 15V17C28 20.866 24.866 24 21 24H16V8ZM19.5 20.5H21C22.933 20.5 24.5 18.933 24.5 17V15C24.5 13.067 22.933 11.5 21 11.5H19.5V20.5Z"
              fill="#60A5FA"
            />
            {/* Accent strategic apex indicator */}
            <circle cx="21" cy="9.5" r="1.5" fill="#38BDF8" />
          </svg>
        </div>
      </div>

      {/* Typography: Cr Dominguez (solo) */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`${titleSizes[size]} tracking-tight leading-none ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Cr Dominguez
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`${subtitleSizes[size]} font-mono font-medium tracking-wider uppercase mt-1 leading-none ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Consultoría Estratégica & CFO
          </span>
        )}
      </div>
    </div>
  );
};
