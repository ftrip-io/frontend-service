import { FC, useState } from "react";

export type Option = {
  value: any;
  label: string;
};

type SelectOptionFieldProps = {
  label: string;
  value: any;
  formElement: any;
  errorMessage?: any;
  disabled?: boolean;
  options: Option[];
};

export const SelectOptionField: FC<SelectOptionFieldProps> = ({
  label = "",
  value,
  formElement,
  errorMessage = "",
  disabled = false,
  options = [],
}) => {
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  if (localErrorMessage != errorMessage) {
    setLocalErrorMessage(errorMessage);
  }

  return (
    <>
      {label ? <label className="block text-lg font-medium text-gray-700">{label}</label> : <></>}
      <select
        disabled={disabled ?? false}
        {...formElement}
        value={value}
        className={
          localErrorMessage
            ? "mt-1 block w-full rounded-md bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 text-sm"
            : "mt-1 block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-xl"
        }
      >
        {options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {localErrorMessage ? <p className="font-medium mt-2 text-sm text-red-600">{localErrorMessage}</p> : <></>}
    </>
  );
};
