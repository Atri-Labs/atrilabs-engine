import { Container, Menu } from "@atrilabs/core";
import {
  gray300,
  gray500,
  gray700,
  gray800,
  h1Heading,
  IconMenu,
} from "@atrilabs/design-system";
import React, {
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { ReactComponent as CompNavIcon } from "./assets/comp-nav-icon.svg";
import { Cross } from "./assets/Cross";
import { useNavigatorNodes } from "./hooks/useComponentNodes";
import {
  clickOverlay,
  hoverOverlay,
  useMarginOverlay,
} from "./hooks/useMarginOverlay";
import { NavigatorNode } from "./types";
import CaretDown from "./assets/CaretDown";
import CaretRight from "./assets/CaretRight";
import { flattenRootNavigatorNode, getNavigatorNodeDomId } from "./utils";
import { useDragDrop } from "./hooks/useDragDrop";
import { useDeleteKey } from "./hooks/useDeleteKey";
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
    overflow: "auto",
    fontFamily: "Inter sans-serif",
  },
  dropContainerItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
  },
  dropContainerItemHeaderH4: {
    ...h1Heading,
    color: gray300,
    margin: "0px",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  iconsSpan: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    width: "1.3rem",
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
  const ref = useRef<HTMLDivElement>(null);

  const { removeMarginOverlay } = useMarginOverlay(clickOverlay);
  const { removeMarginOverlay: removeMarginOverlay1 } =
    useMarginOverlay(hoverOverlay);
  const { rootNavigatorNode, toggleNode, patchCb, openOrCloseMap } =
    useNavigatorNodes();
  const [selectedNode, setSelectedNode] = useState<NavigatorNode | null>(null);
  useDragDrop(rootNavigatorNode, openOrCloseMap, patchCb, setSelectedNode);
  useDeleteKey(selectedNode, () => {
    removeMarginOverlay1();
    removeMarginOverlay();
  });
  // const flattenedNodes = useMemo(() => {
  //   return rootNavigatorNode !== null
  //     ? flattenRootNavigatorNode(rootNavigatorNode)
  //     : [];
  // }, [rootNavigatorNode]);
  const onClickOnNavigator = (evt: MouseEvent) => {
    removeMarginOverlay();
    evt.stopPropagation();
    evt.preventDefault();
  };

  return (
    <>
      <Menu name="PageMenu" order={4}>
        <div style={styles.iconContainer}>
          <IconMenu onClick={openDropContainer} active={false}>
            <CompNavIcon />
          </IconMenu>
        </div>
      </Menu>

      {showDropPanel && rootNavigatorNode ? (
        <Container name="Drop" onClose={closeContainer}>
          <div style={styles.dropContainerItem} onClick={onClickOnNavigator}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Navigator</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>
            <div>
              <div ref={ref}>
                {/* {flattenedNodes.map((node: NavigatorNode) => ( */}
                <ComponentNodeEl
                  key={rootNavigatorNode.id}
                  node={rootNavigatorNode}
                  sendPatch={patchCb}
                  toggleNode={toggleNode}
                  selectedNode={selectedNode}
                  setSelectedNode={setSelectedNode}
                  openOrCloseMap={openOrCloseMap}
                />
                {/* ))} */}
              </div>
            </div>
          </div>
        </Container>
      ) : null}
    </>
  );
}

type ComponentNodeElProps = {
  node: NavigatorNode;
  openOrCloseMap: { [key: string]: boolean };
  sendPatch: (
    id: string,
    newParentId: string,
    newIndex: number,
    isMovingUp: boolean
  ) => void;
  toggleNode: (id: string) => void;
  selectedNode?: NavigatorNode | null;
  setSelectedNode: (node: NavigatorNode) => void;
};

const ComponentNodeEl: React.FC<ComponentNodeElProps> = ({
  node,
  sendPatch,
  toggleNode,
  selectedNode,
  setSelectedNode,
  openOrCloseMap,
}) => {
  const { createMarginOverlay, removeMarginOverlay } =
    useMarginOverlay(hoverOverlay);
  const {
    createMarginOverlay: createMarginOverlay1,
    removeMarginOverlay: removeMarginOverlay1,
  } = useMarginOverlay(clickOverlay);
  const children = node.children?.map((child) => (
    <ComponentNodeEl
      key={child.id}
      node={child}
      sendPatch={sendPatch}
      toggleNode={toggleNode}
      selectedNode={selectedNode}
      setSelectedNode={setSelectedNode}
      openOrCloseMap={openOrCloseMap}
    />
  ));
  const showOverlay = (evt: React.MouseEvent) => {
    removeMarginOverlay();
    createMarginOverlay(node.id);
    evt.preventDefault();
  };
  const showOverlayOnClick = (evt: React.MouseEvent) => {
    removeMarginOverlay1();
    createMarginOverlay1(node.id);
    setSelectedNode(node);
    evt.stopPropagation();
    evt.preventDefault();
  };
  const isOpen = openOrCloseMap[node.id];

  const toggleOpen = (evt: React.MouseEvent) => {
    if (node.type === "acceptsChild") {
      toggleNode(node.id);
    }
    evt.stopPropagation();
    evt.preventDefault();
  };
  const hideOverlay = (evt: React.MouseEvent) => {
    removeMarginOverlay();
    evt.preventDefault();
  };
  return (
    <div
      id={getNavigatorNodeDomId(node.id)}
      style={{
        marginLeft: "10px",
        padding: "4px 0px",
        backgroundColor:
          selectedNode && selectedNode.id === node.id ? gray800 : "transparent",
      }}
      onClick={showOverlayOnClick}
    >
      {node.type === "acceptsChild" && (
        <span onClick={toggleOpen}>
          {isOpen ? <CaretDown /> : <CaretRight />}
        </span>
      )}
      <span
        style={{
          color:
            selectedNode && selectedNode.id === node.id ? gray500 : gray300,
        }}
        onMouseEnter={showOverlay}
        onMouseLeave={hideOverlay}
      >
        {" "}
        {node.name}
      </span>
      {isOpen && children}
    </div>
  );
};
