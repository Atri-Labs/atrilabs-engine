import { gray300, gray500, smallText } from "@atrilabs/design-system";
import CaretDown from "../assets/CaretDown";
import CaretRight from "../assets/CaretRight";
import { tabbedContentHeight } from "../utils";
import "./TabbedContent.css";

export type TabbedContentProps = {
  tabs: number;
  id: string;
  name: string;
  showRightCaret?: boolean;
  showDownCaret?: boolean;
  onCaretClicked?: (id: string) => void;
};

const padding = 0.5;

const linePositionsMap: { [key: number]: number[] } = {};
/**
 *
 * @param tabs number of tabs
 * @returns an array with padding positions
 */
function getLinePositions(tabs: number) {
  if (linePositionsMap[tabs] === undefined) {
    const linePositions: number[] = [];
    for (let i = 0; i < tabs; i++) {
      // + 1 for extra padding on the left
      linePositions.push(i * padding + 1);
    }
    linePositionsMap[tabs] = linePositions;
  }
  return linePositionsMap[tabs];
}

export const TabbedContent: React.FC<TabbedContentProps> = (props) => {
  return (
    <div
      style={{ height: `${tabbedContentHeight}px`, position: "relative" }}
      className="tabbed-content-comp-nav"
    >
      {props.tabs > 0
        ? getLinePositions(props.tabs).map((left) => {
            return (
              <div
                style={{
                  background: gray500,
                  width: "1px",
                  height: "100%",
                  position: "absolute",
                  left: `${left}rem`,
                }}
                key={left}
              ></div>
            );
          })
        : null}

      <div
        style={{
          ...smallText,
          color: gray300,
          position: "absolute",
          // + 1 for extra padding on the left
          left: `${props.tabs * padding + 1}rem`,
          top: "50%",
          transform: "translate(0, -50%)",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            paddingRight: "4px",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => {
            props.onCaretClicked?.(props.id);
          }}
        >
          {props.showRightCaret ? <CaretRight /> : null}
          {props.showDownCaret ? <CaretDown /> : null}
        </div>
        <span>{props.name}</span>
      </div>
    </div>
  );
};
