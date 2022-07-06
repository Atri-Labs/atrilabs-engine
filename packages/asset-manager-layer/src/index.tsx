import { Menu } from "@atrilabs/core";
import { gray800 } from "@atrilabs/design-system";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
  },
};

export default function () {
  return (
    <>
      <Menu name="AppMenu">
        <div style={styles.iconContainer}>Asset Manager</div>
      </Menu>
    </>
  );
}
