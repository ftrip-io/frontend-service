import { type FC, useState } from "react";

type IntegerInputProps = {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
};

export const IntegerInput: FC<IntegerInputProps> = ({
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const handleDecrementClick = () => {
    const newValue = Math.max(min, inputValue - 1);
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleIncrementClick = () => {
    const newValue = Math.min(max, inputValue + 1);
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex rounded-md overflow-hidden items-center text-center">
      <button
        type="button"
        className="w-8 h-8 rounded-full border-black border hover:bg-gray-200 text-xl pb-7 disabled:border-none disabled:text-gray-100"
        onClick={handleDecrementClick}
        disabled={inputValue <= min}
      >
        -
      </button>
      <span className="mx-4">{inputValue}</span>
      <button
        type="button"
        className="w-8 h-8 rounded-full border-black border hover:bg-gray-200 text-xl pb-7 disabled:border-none disabled:text-gray-100"
        onClick={handleIncrementClick}
        disabled={inputValue >= max}
      >
        +
      </button>
    </div>
  );
};

export default IntegerInput;
