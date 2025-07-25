import React from 'react';

interface ScoreLogoProps {
  variant?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'xlarge';
  className?: string;
  fixed?: boolean; // optionnel : logo en position absolue/fixe
}

const ScoreLogo: React.FC<ScoreLogoProps> = ({
  variant = 'horizontal',
  size = 'large',
  className = '',
  fixed = false
}) => {
  const sizes = {
  small: {
    width: variant === 'horizontal' ? '120px' : '80px',
    height: variant === 'horizontal' ? '30px' : '80px'
  },
  medium: {
    width: variant === 'horizontal' ? '160px' : '120px',
    height: variant === 'horizontal' ? '40px' : '120px'
  },
  large: {
    width: variant === 'horizontal' ? '200px' : '160px',
    height: variant === 'horizontal' ? '60px' : '160px'
  },
  xlarge: {
    width: variant === 'horizontal' ? '340px' : '300px',
    height: variant === 'horizontal' ? '120px' : '280px'
  }
};

  const positionStyle = fixed
    ? {
        position: 'absolute' as const,
        top: '1rem',
        left: '1rem',
        zIndex: 50
      }
    : {};

  return (
    <img
      src="/src/assets/score_logoo.png"
      alt="Score Logo"
      style={{ ...sizes[size], ...positionStyle }}
      className={`object-contain ${className}`}
    />
  );
};

export default ScoreLogo;
