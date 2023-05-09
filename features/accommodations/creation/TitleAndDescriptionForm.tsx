import { type FC } from "react";
import { type CreateAccommodation } from "../createAccommodation";
import { SimpleTextInput } from "../../../core/components/SimpleTextInput";

type TitleAndDescriptionFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  title: string;
  description: string;
};

export const TitleAndDescriptionForm: FC<TitleAndDescriptionFormProps> = ({
  updateFields,
  title,
  description,
}) => {
  return (
    <>
      <SimpleTextInput
        label="Title"
        value={title}
        onChange={(e) => updateFields({ title: e.target.value })}
        maxLength={50}
        required
      />
      <span className="float-right text-sm">{title.length}/50</span>
      <label className="block text-lg font-medium text-gray-700 mt-5">Description</label>
      <textarea
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={description}
        onChange={(e) => updateFields({ description: e.target.value })}
        rows={10}
        maxLength={500}
        required
      />
      <span className="float-right text-sm">{description.length}/500</span>
    </>
  );
};
