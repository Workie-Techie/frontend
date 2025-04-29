import React from 'react';

const Logo = ({ className = "h-10" }) => {
  return (
    <div className={`font-bold text-amber-500 flex items-center ${className}`}>
      <span className="text-2xl mr-1">Workie</span>
      <span className="text-2xl text-gray-800">Techie</span>
    </div>
  );
};

export default Logo;