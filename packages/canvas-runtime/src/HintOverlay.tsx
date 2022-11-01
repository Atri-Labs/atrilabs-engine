import { useHintOverlays } from "./hooks/useHintOverlays";
import { Dimension } from "./types";

export const HintOverlay: React.FC<{ dimension: Dimension }> = (props) => {
  const hintOverlays = useHintOverlays();
  return (
    <>
      {hintOverlays.map((hint) => {
        return hint;
      })}
    </>
  );
};
