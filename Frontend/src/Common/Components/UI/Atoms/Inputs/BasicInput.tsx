import { LucideEye, LucideEyeOff } from "lucide-react";
import { ChangeEventHandler, FocusEventHandler, useState } from "react";

interface basicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  id: string;
  value: string;
  isError: boolean;
  errorMessage: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  type: "text" | "password" | "number";
}

export const BasicInput: React.FC<basicInputProps> = ({
  label,
  placeholder,
  id,
  value,
  isError,
  errorMessage,
  onChange,
  onBlur,
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className={`inline-block mb-2 text-base font-medium ${
          isError ? "text-red-500" : "text-gray-800"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          id={id}
          className={`form-input border-1 rounded-xl focus:outline-none ${
            isError
              ? "border-red-500 focus:border-red-500"
              : "border-slate-200 focus:border-custom-500"
          } dark:border-zink-500 dark:focus:border-custom-800 
          placeholder:text-slate-400 dark:placeholder:text-zink-200
          disabled:bg-slate-100 dark:disabled:bg-zink-600 
          disabled:border-slate-300 dark:disabled:border-zink-500 
          disabled:text-slate-500 dark:disabled:text-zink-200 dark:text-zink-100 
          dark:bg-zink-700`}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
        {type === "password" ? (
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
          >
            {showPassword ? (
              <LucideEyeOff size={22} />
            ) : (
              <LucideEye size={22} />
            )}
          </div>
        ) : null}
      </div>

      {isError ? (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
};
