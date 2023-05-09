import { useCallback, useState } from "react";

const useHoverable = () => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  return {
    isHover,
    hoverAttributes: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
};

export { useHoverable };
