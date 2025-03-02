import React, { FocusEventHandler } from "react";
import Select from "react-select";

export interface OptionSelect {
  readonly label: string;
  readonly value?: string;
  readonly options?: OptionSelect[];
  readonly isDisabled?: boolean;
}

interface SelectComponentProps {
  defaultValue?: OptionSelect;
  options: OptionSelect[];
  isMulti?: boolean;
  label: string;
  placeholder?: string;
  id: string;
  isError?: boolean;
  errorMessage?: string;
  onChange: (e: OptionSelect) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  value?: OptionSelect;
}

export const SelectComponent: React.FC<SelectComponentProps> = ({
  defaultValue,
  options,
  isMulti,
  label,
  placeholder,
  id,
  isError,
  errorMessage,
  onChange,
  onBlur,
  value,
}) => {
  return (
    <div className="mb-3 container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
  <label
    className={`inline-block mb-2 text-base font-medium ${
      isError ? "text-red-500" : "text-gray-800"
    }`}
  >
    {label}
  </label>
  <div
    className={` ${
      isError ? "border-red-500" : "border-slate-300"
    } focus-within:outline-none dark:border-zinc-500 dark:focus-within:border-custom-800`}
  >
    <Select
      className="basic-select"
      classNamePrefix={`custom-select ${isError ? "custom-select-error" : ""}`}
      id={id}
      data-choices
      name="choices-multiple-default"
      placeholder={placeholder}
      defaultValue={[defaultValue]}
      isMulti={isMulti}
      options={options}
      onChange={(e) => onChange(e as OptionSelect)}
      onBlur={onBlur}
      value={value ?? ""}
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: "0.7rem", 
          borderColor: isError ? "#EF4444" : "#E5E7EB", 
          "&:hover": {
            borderColor: isError ? "#EF4444" : "#A3A3A3", 
          },
          boxShadow: state.isFocused
            ? isError
              ? "0 0 0 1px #EF4444"
              : "0 0 0 1px #A3A3A3"
            : "none",
        }),
      }}
    />
  </div>
  {isError ? (
    <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
  ) : null}
</div>


  );
};
