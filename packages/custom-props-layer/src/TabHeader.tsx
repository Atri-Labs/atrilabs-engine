import { gray800 } from "@atrilabs/design-system";
import { ReactComponent as SettingsIcon } from "./assets/settings.svg";

export const TabHeader: React.FC = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRight: `1px solid ${gray800}`,
      }}
    >
      <SettingsIcon />
    </div>
  );
};
