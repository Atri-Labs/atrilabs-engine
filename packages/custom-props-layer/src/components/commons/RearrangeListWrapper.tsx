import { RearrangeList, RearrangeListProps } from "@atrilabs/shared-layer-lib";
import { ReactComponent as DragIndicatorIcon } from "../../assets/drag-indicator.svg";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";

export type RearrangeListWrapperProps = {
  onReposition: RearrangeListProps["onReposition"];
  onMinusClick: (index: number) => void;
  children: React.ReactNode[];
  minusButton: boolean;
};

export const RearrangeListWrapper: React.FC<RearrangeListWrapperProps> = (
  props
) => {
  return (
    <RearrangeList
      onReposition={props.onReposition}
      iconItem={
        <div
          style={{
            width: "24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <DragIndicatorIcon />
        </div>
      }
      items={props.children.map((value, index) => {
        return {
          node: (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              {value}
              {props.minusButton && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                  onClick={() => {
                    props.onMinusClick(index);
                  }}
                >
                  <MinusIcon />
                </div>
              )}
            </div>
          ),
          key: index.toString(),
        };
      })}
    />
  );
};
