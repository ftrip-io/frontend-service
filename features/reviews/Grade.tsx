import { type FC } from "react";

type GradeProps = {
  title: string;
  grade: number;
};

export const Grade: FC<GradeProps> = ({ title, grade }) => {
  const percentage = ((grade || 0) / 5) * 100;

  return (
    <div>
      <div className="text-center">{title}</div>

      <div className="flex space-x-1 items-center justify-center">
        <div className="text-sm">1</div>
        <div className="block">
          <div className={`w-80 bg-gray-300 rounded-full h-2.5 mb-2`}>
            <div
              className="bg-green-500 h-2.5 rounded-full my-2"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="text-sm">5</div>
      </div>
    </div>
  );
};
