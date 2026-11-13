import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  loading?: 'eager' | 'lazy';
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3F0EA] to-[#E6E0D6] dark:from-[#26211D] dark:to-[#1D1916] text-[#57534E] dark:text-[#D6D3D1] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Utensils className="w-8 h-8 mb-2 text-[#1B4332] dark:text-[#74C69D] opacity-80" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-[#1C1815] dark:text-[#F5F2EC]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
