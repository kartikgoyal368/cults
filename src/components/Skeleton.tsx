import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'pill';
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({
  width,
  height,
  variant = 'rect',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const variantClass = variant === 'circle' ? styles.circle : variant === 'pill' ? styles.pill : '';

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}
