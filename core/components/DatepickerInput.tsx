import { type FC } from "react";

type DatepickerInputProps = {
  label: string;
  value: string;
  onChange: (date: string) => any;
};

export const DatepickerInput: FC<DatepickerInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="block">
      <label className="block text-lg font-medium text-gray-700">{label}</label>
      <input
        type="date"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
