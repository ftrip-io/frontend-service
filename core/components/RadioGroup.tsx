import { ChangeEvent, useCallback, type FC } from "react";

type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  name: string;
  options: RadioOption[];
  value: string;
  formElement: any;
  onChange: (newValue: string) => void;
};

export const RadioGroup: FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  name,
  formElement,
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (newValue !== value) {
        onChange(newValue);
      }
    },
    [onChange, value]
  );

  return (
    <>
      {options.map((option, i) => (
        <p key={name + i}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={handleChange}
            className="cursor-pointer"
            {...formElement}
          />
          <span className="ml-2">{option.label}</span>
        </p>
      ))}
    </>
  );
};

export default RadioGroup;
