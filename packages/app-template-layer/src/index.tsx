import { useCallback, useState } from "react";
import { Container, Menu } from "@atrilabs/core";
import { gray700, gray800, IconMenu } from "@atrilabs/design-system";
import { ReactComponent as OpenTemplateIcon } from "./assets/open-template.svg";
import { Cross } from "./assets/Cross";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
  },
  dropContainerItem: {
    width: "15rem",
    height: `100%`,
    backgroundColor: gray700,
    boxSizing: "border-box",
    userSelect: "none",
  },
};

export default function () {
  const [showDropPanel, setShowDropContianer] = useState<boolean>(false);
  const openDropContainer = useCallback(() => {
    setShowDropContianer(true);
  }, []);
  const closeContainer = useCallback(() => {
    setShowDropContianer(false);
  }, []);

  return (
    <>
      <Menu name="PageMenu">
        <div style={styles.iconContainer}>
          <IconMenu onClick={openDropContainer} active={false}>
            <OpenTemplateIcon />
          </IconMenu>
        </div>
      </Menu>
      {showDropPanel ? (
        <Container name="Drop">
          <div style={styles.dropContainerItem}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Insert Component</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>
            Shyam
          </div>
        </Container>
      ) : null}
    </>
  );
}
