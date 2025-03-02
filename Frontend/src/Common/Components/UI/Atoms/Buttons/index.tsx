import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const BasicButton: React.FC<ButtonProps> = ({
  children,
  className,
  type,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={
        "btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20" +
        className
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
