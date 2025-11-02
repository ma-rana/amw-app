import React from 'react';
import { useResponsive } from '../hooks/useResponsive';

const ResponsiveGrid = ({ 
  children, 
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = 'var(--spacing-lg)',
  className = '',
  ...props 
}) => {
  const { currentBreakpoint } = useResponsive();
  
  const currentColumns = columns[currentBreakpoint] || columns.xl || 1;
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
    gap: gap,
    width: '100%',
    ...props.style
  };

  return (
    <div 
      className={`responsive-grid ${className}`}
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;