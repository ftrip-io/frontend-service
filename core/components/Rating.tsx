import { type FC } from "react";
import ReactStars from "react-rating-stars-component";

type RatingProps = {
  label: string;
  count?: number;
  value: number;
  onChange: (newValue: number) => any;
};

export const Rating: FC<RatingProps> = ({
  label = "",
  count = 5,
  value = 1,
  onChange = () => {},
}: any) => {
  return (
    <>
      {label ? <label className="block text-lg font-medium text-gray-700">{label}</label> : <></>}
      <ReactStars
        key={value}
        count={count}
        value={value}
        onChange={onChange}
        size={24}
        activeColor="#000000"
      />
    </>
  );
};
