import { gray800 } from "@atrilabs/design-system";

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  // children of outerDiv
  header: {
    height: "2.5rem",
    background: gray800,
    display: "flex",
    justifyContent: "space-between",
  },
  body: {},

  // chilren of header
  leftHeader: {},
  middleHeader: {},
  rightHeader: {},

  // chilren of leftHeader
  appMenu: {},
  pageMenu: {},

  // children of  middleHeader
  canvasMenu: {},

  // children of rightHeader
  publishMenu: {},
};

export const BaseContainer: React.FC = () => {
  return (
    <div style={styles.outerDiv}>
      <div style={styles.header}>
        <div style={styles.leftHeader}>
          <div style={styles.appMenu}></div>
          <div style={styles.pageMenu}></div>
        </div>
        <div style={styles.middleHeader}>
          <div style={styles.canvasMenu}></div>
        </div>
        <div style={styles.rightHeader}>
          <div style={styles.publishMenu}></div>
        </div>
      </div>
      <div style={styles.body}></div>
    </div>
  );
};
