import React from 'react';

const Button = ({ children, primary, secondary, outline, className, onClick, type = "button", icon: Icon, ...props }) => {
  const baseStyles = "px-6 py-3 cursor-pointer rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2";
  let variantStyles = "";

  if (primary) {
    variantStyles = "bg-[#DF9F27] text-white hover:bg-yellow-500 focus:ring-[#DF9F27]";
  } else if (secondary) {
    variantStyles = "bg-[#154B6C] text-white hover:bg-[#16629E] focus:ring-[#154B6C]";
  } else if (outline) {
    variantStyles = `border-2 ${primary ? 'border-[#DF9F27] text-[#DF9F27] hover:bg-[#DF9F27] hover:text-white' : 'border-[#154B6C] text-[#154B6C] hover:bg-[#154B6C] hover:text-white'} focus:ring-current`;
  }
   else {
    variantStyles = "bg-gray-200 text-[#1A202C] hover:bg-gray-300 focus:ring-gray-400";
  }

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;