const Button = ({ children, width, height, padding, margin, fontSize, className = "", onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={` text-center border rounded-[6px] bg-gray-400 hover:opacity-80 hover:cursor-pointer hover:text-white hover:underline hover:underline-offset-2 opacity-90 font-semibold ${width || ""} ${height || ""} ${padding || ""} ${margin || ""} ${fontSize || ""} ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
