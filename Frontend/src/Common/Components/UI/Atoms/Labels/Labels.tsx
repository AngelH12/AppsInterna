type colorsType =
  | "custom"
  | "green"
  | "orange"
  | "sky"
  | "yellow"
  | "red"
  | "purple"
  | "state";

interface labelsProps {
  //text: string;
  color: colorsType;
  children?: React.ReactNode;
}

export const Labels: React.FC<labelsProps> = ({ color, children }) => {
  const getColor = () => {
    const colors = {
      custom: "bg-custom-100 text-custom-500 dark:bg-custom-500/20",
      green: "bg-green-100 text-green-500 dark:bg-green-500/20",
      orange: "bg-orange-100 text-orange-500 dark:bg-orange-500/20",
      sky: "bg-sky-100 text-sky-500 dark:bg-sky-500/20",
      yellow: "bg-yellow-100 text-yellow-500 dark:bg-yellow-500/20",
      red: "bg-red-100 text-red-500 dark:bg-red-500/20",
      purple: "bg-purple-100 text-purple-500 dark:bg-purple-500/20",
      state: "bg-state-100 text-state-500 dark:bg-state-500/20",
    };

    return colors[color];
  };

  return (
    <span
      className={`px-2.5 py-0.5 inline-block text-xs font-medium rounded-full border ${getColor()} border-transparent`}
    >
      {children}
    </span>
  );
};
