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
  outerDiv: { height: "100%", width: "100%", display: "flex" },

  // outerDiv children
  leftPanel: {
    width: "2.5rem",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  containerPanel: { flexGrow: 1 },

  // leftPanel children
  logo: { width: "2.5rem", height: "2.5rem" },
  menuContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },

  // menuContainer children
  headerMenu: {},
  footerMenu: {},
};

export const App: React.FC = () => {
  return (
    <div style={styles.outerDiv}>
      <div style={styles.leftPanel}>
        <div style={styles.logo}></div>
        <div style={styles.menuContainer}>
          <div style={styles.headerMenu}></div>
          <div style={styles.footerMenu}></div>
        </div>
      </div>
      <div style={styles.containerPanel}></div>
    </div>
  );
};
