import React from 'react';
import Switch from "react-switch";

interface SwitchComponentProps {
  isOn?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  onColor?: string;
  offColor?: string;
  size?: "small" | "medium" | "large";
  label?: string;
  className?: string;
}

export const SwitchComponent: React.FC<SwitchComponentProps> = ({
  isOn = false,
  onChange = () => {},
  disabled = false,
  onColor = "#86d3ff",
  offColor = "#ccc",
  size = "medium",
  label = "",
  className = ""
}) => {
  // Configura los tamaños del switch
  const sizes = {
    small: { width: 28, height: 16 },
    medium: { width: 40, height: 20 },
    large: { width: 52, height: 24 }
  };

  const { width, height } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-sm">{label}</span>}
      <Switch
        onChange={onChange}
        checked={isOn}
        disabled={disabled}
        onColor={onColor}
        offColor={offColor}
        width={width}
        height={height}
        handleDiameter={height - 4}
        uncheckedIcon={false}
        checkedIcon={false}
        className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      />
    </div>
  );
};