import { gray300 } from "@atrilabs/design-system";
import { CallbackHandler } from "@atrilabs/react-component-manifest-schema/lib/types";
import { ReactComponent as AddIcon } from "./assets/add.svg";

export type TabBodyProps = {
  patchCb: (slice: any) => void;
  compId: string;
  // comes from component tree
  callbacks: { [callbackName: string]: CallbackHandler };
  // comes from component manifest
  callbackNames: string[];
};

export const TabBody: React.FC<TabBodyProps> = (props) => {
  console.log(props);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {props.callbackNames.map((callbackName) => {
        return (
          <div
            key={callbackName}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: gray300,
              }}
            >
              <div>{callbackName}</div>
              <div>
                <AddIcon />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
