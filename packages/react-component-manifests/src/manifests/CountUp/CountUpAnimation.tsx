import React, { useEffect, useState } from "react";
const easeOutQuad = (t: number) => t * (2 - t);
const frameDuration = 1000 / 60;
export const CountUpAnimation: React.FC<CountUpAnimationProp> = ({
  value,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round(duration / frameDuration);
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      setCount(value * progress);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
  }, [value, duration]);
  return <>{Math.floor(count)}</>;
};
interface CountUpAnimationProp {
  value: number;
  duration?: number;
}
//Reference : https://jshakespeare.com/simple-count-up-number-animation-javascript-react/
