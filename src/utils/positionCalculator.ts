import { PlayerPosition, PlayerSize } from '../types';

export const getSizeValues = (size: PlayerSize, customWidth?: number, customHeight?: number) => {
  if (size === 'custom' && customWidth && customHeight) {
    return { width: customWidth, height: customHeight };
  }

  const sizes = {
    small: { width: 320, height: 180 },
    medium: { width: 480, height: 270 },
    large: { width: 640, height: 360 },
  };

  return sizes[size as keyof typeof sizes] || sizes.medium;
};

export const getPositionStyles = (position: PlayerPosition): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
  };

  const positions: Record<PlayerPosition, React.CSSProperties> = {
    'bottom-right': {
      ...baseStyles,
      bottom: '20px',
      right: '20px',
    },
    'bottom-left': {
      ...baseStyles,
      bottom: '20px',
      left: '20px',
    },
    'top-right': {
      ...baseStyles,
      top: '20px',
      right: '20px',
    },
    'top-left': {
      ...baseStyles,
      top: '20px',
      left: '20px',
    },
    'center': {
      ...baseStyles,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    'custom': baseStyles,
  };

  return positions[position];
};
