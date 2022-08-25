import { amber300 } from "@atrilabs/design-system";

export type RelativeDirectorySelectorProps = {
  seletecdDir: string;
  relativeDirs: string[];
  onRelativeDirSelect: (selectedRelativeDir: string) => void;
};

export const RelativeDirectorySelector: React.FC<
  RelativeDirectorySelectorProps
> = (props) => {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      {props.relativeDirs.map((relativeDir) => {
        return (
          <div
            style={{
              borderBottom:
                props.seletecdDir === relativeDir
                  ? `1px solid ${amber300}`
                  : "",
              height: "100%",
              padding: "0.5rem 1rem",
              boxSizing: "border-box",
            }}
            onClick={() => {
              props.onRelativeDirSelect(relativeDir);
            }}
            key={relativeDir}
          >
            {relativeDir}
          </div>
        );
      })}
    </div>
  );
};
