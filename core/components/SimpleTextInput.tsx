import { type FC, type ChangeEventHandler } from "react";

type SimpleTextInputProps = {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  maxLength?: number;
};

export const SimpleTextInput: FC<SimpleTextInputProps> = ({
  label,
  value,
  onChange,
  required,
  maxLength,
}) => {
  return (
    <>
      <label className="block text-lg font-medium text-gray-700">{label}</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={value}
        onChange={onChange}
        required={required ?? false}
        maxLength={maxLength}
      />
    </>
  );
};
