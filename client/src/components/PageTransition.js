import React from 'react';
import './PageTransition.css';

export default function PageTransition({ children, animation = 'slideInUp' }) {
  const animationClass = animation === 'fade' ? 'page-fade' : 'page-transition';
  
  return (
    <div className={animationClass}>
      {children}
    </div>
  );
}
