import { type FC } from "react";

type CheckboxProps = {
  label: string;
  formElement: any;
  checked: boolean;
  value: string;
};

export const Checkbox: FC<CheckboxProps> = ({ label, formElement, checked, value }) => {
  return (
    <>
      <div className="flex space-x-2">
        <div>
          <input name={label} type="checkbox" checked={checked} value={value} {...formElement} />
        </div>
        <label className="text-lg font-medium text-gray-700" htmlFor={label}>
          {label}
        </label>
      </div>
    </>
  );
};
