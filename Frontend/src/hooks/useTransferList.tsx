import { useState } from 'react';

export function useTransferList<T>(initialLeft: T[], initialRight: T[]) {
  const [checked, setChecked] = useState<T[]>([]);
  const [left, setLeft] = useState<T[]>(initialLeft);
  const [right, setRight] = useState<T[]>(initialRight);

  const not = (a: readonly T[], b: readonly T[]) => a.filter((value) => !b.includes(value));
  const intersection = (a: readonly T[], b: readonly T[]) => a.filter((value) => b.includes(value));
  const union = (a: readonly T[], b: readonly T[]) => [...a, ...not(b, a)];

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: T) => {
    setChecked((prevChecked) =>
      prevChecked.includes(value) ? prevChecked.filter((v) => v !== value) : [...prevChecked, value]
    );
  };

  const handleToggleAll = (items: readonly T[]) => {
    setChecked((prevChecked) =>
      intersection(prevChecked, items).length === items.length ? not(prevChecked, items) : union(prevChecked, items)
    );
  };

  const moveCheckedRight = () => {
    setRight((prev) => [...prev, ...leftChecked]);
    setLeft((prev) => not(prev, leftChecked));
    setChecked((prev) => not(prev, leftChecked));
  };

  const moveCheckedLeft = () => {
    setLeft((prev) => [...prev, ...rightChecked]);
    setRight((prev) => not(prev, rightChecked));
    setChecked((prev) => not(prev, rightChecked));
  };

  return {
    left,
    right,
    checked,
    handleToggle,
    handleToggleAll,
    moveCheckedRight,
    moveCheckedLeft,
    leftChecked,
    rightChecked,
  };
}
