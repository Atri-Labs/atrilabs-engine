import { useCallback, useState } from "react";
import { Container, Menu } from "@atrilabs/core";
import { gray800, IconMenu } from "@atrilabs/design-system";
import { ReactComponent as Insert } from "./assets/insert.svg";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
  },
};

export default function () {
  const [showInsertPanel, setShowInsertPanel] = useState<boolean>(false);
  const onClick = useCallback(() => {
    setShowInsertPanel(true);
  }, []);
  return (
    <>
      <Menu name="PageMenu">
        <div style={styles.iconContainer}>
          <IconMenu onClick={onClick} active={false}>
            <Insert />
          </IconMenu>
        </div>
      </Menu>
      {showInsertPanel ? (
        <Container name="Drop">
          <div>Dropped</div>
        </Container>
      ) : null}
    </>
  );
}
