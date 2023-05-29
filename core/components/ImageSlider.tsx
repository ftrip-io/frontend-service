import Image from "next/image";
import { type FC } from "react";
import { useMultistepForm } from "../hooks/useMultistepForm";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const SliderDots: FC<{
  items: number;
  current: number;
  onClick: (i: number) => void;
  maxVisibleDots?: number;
}> = ({ items, current, onClick, maxVisibleDots = 5 }) => {
  const startDotIndex = Math.min(
    Math.max(0, current - Math.floor(maxVisibleDots / 2)),
    items - maxVisibleDots
  );
  const endDotIndex = Math.min(startDotIndex + maxVisibleDots, items);

  return (
    <div className="flex">
      {Array.from(
        { length: items },
        (_, i) =>
          i >= startDotIndex &&
          i < endDotIndex && (
            <span
              key={i}
              className={`w-2 h-2 rounded-full m-1 ${
                i === current ? "bg-gray-100" : "bg-gray-400"
              }`}
              onClick={() => onClick(i)}
            />
          )
      )}
    </div>
  );
};

export const ImageSlider: FC<{ images: string[]; width?: number; height?: number }> = ({
  images,
  width = 1000,
  height = 1000,
}) => {
  const { step, isFirstStep, isLastStep, back, next, goTo, currentStepIndex } = useMultistepForm(
    images?.map((url) => (
      <Image
        src={url}
        alt="image"
        width={width}
        height={height}
        className="h-80 w-80 object-cover rounded-xl"
        priority={true}
        key={url}
      />
    )) ?? []
  );

  return (
    <div className="w-80">
      <div className="group relative">
        {!isFirstStep && (
          <button
            className="hidden group-hover:block absolute left-0 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-80 bg-gray-50 hover:bg-gray-200"
            onClick={back}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        )}
        {step}
        {!isLastStep && (
          <button
            className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-80 bg-gray-50 hover:bg-gray-200"
            onClick={next}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        )}
        <div className="absolute right-1/2 translate-x-1/2 bottom-1">
          <SliderDots current={currentStepIndex} items={images?.length} onClick={goTo} />
        </div>
      </div>
    </div>
  );
};
