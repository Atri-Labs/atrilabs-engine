import { Menu } from "@atrilabs/core";
import { useGetServiceStatus } from "./hooks/useGetServiceStatus";
import { ReactComponent as RedDot } from "./assets/red_dot.svg";
import { ReactComponent as GreenDot } from "./assets/green_dot.svg";

export default function () {
  const { status } = useGetServiceStatus();
  return (
    <>
      <Menu name="BaseFooterMenu" order={0}>
        <div
          style={{
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {status.isEventServerConnected &&
          status.isIPCServerConnected &&
          status.publishServerConnected &&
          status.atriCLIConnected ? (
            <GreenDot />
          ) : (
            <RedDot />
          )}
        </div>
      </Menu>
    </>
  );
}
