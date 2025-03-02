import React from "react";

interface DottedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  py?: string; 
  variant?: "standard" | "success" | "error";
}

export const DottedButton: React.FC<DottedButtonProps> = ({ text, variant = "success", py = "3", ...props }) => {
  const isStandard = variant === "standard";
  const isError = variant === "error";

  return (
    <button
      className={`rounded-2xl border-2 px-6 py-${py} font-semibold uppercase transition-all duration-300 ${
        isStandard
          ? "border-dashed border-gray-500 bg-gray-100 text-gray-500 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_#6b7280] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
          : isError
          ? "border-dashed border-red-500 bg-white text-red-500 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_#ef4444] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
          : "border-dashed border-blue-500 bg-white text-blue-500 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_#3b82f6] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
      }`}
      {...props}
    >
      {text}
    </button>
  );
};
