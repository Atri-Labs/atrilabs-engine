import { gray700, gray800 } from "@atrilabs/design-system";
import { useBaseContainer } from "./hooks/useBaseContainer";
import { useFooterMenu } from "./hooks/useFooterMenu";
import { useHeaderMenu } from "./hooks/useHeaderMenu";
import { useLogo } from "./hooks/useLogo";
import { useOverlayContainer } from "./hooks/useOverlayContainer";

const adjustRootCSS = () => {
  const body = document.body;
  const root = document.getElementById("root");
  if (root) {
    body.style.margin = "0px";
    body.style.padding = "0px";
    root.style.height = "100vh";
    root.style.width = "100%";
  }
};

adjustRootCSS();

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    height: "100%",
    width: "100%",
    display: "flex",
    position: "relative",
  },

  // outerDiv children
  overlayContainer: {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },

  leftPanel: {
    width: "2.5rem",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  containerPanel: { flexGrow: 1 },

  // leftPanel children
  logo: { width: "2.5rem", height: "2.5rem", backgroundColor: gray700 },
  menuContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: gray700,
    borderRight: `1px solid ${gray800}`,
    boxSizing: "border-box",
  },

  // menuContainer children
  headerMenu: {},
  footerMenu: {},
};

export const App: React.FC = () => {
  const logoItem = useLogo();
  const headerMenuItems = useHeaderMenu();
  const footerMenuItems = useFooterMenu();
  const baseContainer = useBaseContainer();
  const overlayContainer = useOverlayContainer();
  return (
    <div style={styles.outerDiv}>
      {overlayContainer ? (
        <div style={styles.overlayContainer}>
          <overlayContainer.comp {...overlayContainer.props} />
        </div>
      ) : null}
      <div style={styles.leftPanel}>
        <div style={styles.logo}>
          {logoItem ? <logoItem.comp {...logoItem.props} /> : null}
        </div>
        <div style={styles.menuContainer}>
          <div style={styles.headerMenu}>
            {headerMenuItems.map((item) => {
              return <item.comp {...item.props} />;
            })}
          </div>
          <div style={styles.footerMenu}>
            {footerMenuItems.map((item) => {
              return <item.comp {...item.props} />;
            })}
          </div>
        </div>
      </div>
      <div style={styles.containerPanel}>
        {baseContainer ? <baseContainer.comp {...baseContainer.props} /> : null}
      </div>
    </div>
  );
};
