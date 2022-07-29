import { useCallback, useRef, useState } from "react";
import { Container, getId, Menu } from "@atrilabs/core";
import {
  amber300,
  gray300,
  gray700,
  gray800,
  gray900,
  h1Heading,
  h4Heading,
  IconMenu,
  smallText,
} from "@atrilabs/design-system";
import { ReactComponent as OpenTemplateIcon } from "./assets/open-template.svg";
import { Cross } from "./assets/Cross";
import { useComponentSelected } from "./hooks/useComponentSelected";
import { useCreateTemplate } from "./hooks/useCreateTemplate";
import { useTemplateApi } from "./hooks/useTemplateApi";
import { startDrag } from "@atrilabs/canvas-runtime";
import { DragTemplateComp } from "./components/DragTemplateComp";

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
  outerDiv: {
    ...smallText,
    color: gray300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    borderLeft: `1px solid ${gray800}`,
    borderRight: `1px solid ${gray800}`,
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    userSelect: "none",
  },
  popupDiv: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "100%",
    backgroundColor: "black",
    width: "10rem",
    zIndex: 1,
    right: 0,
  },
};

export default function () {
  const { templatesData, callCreateTeamplateApi } = useTemplateApi();

  const [showDropPanel, setShowDropContianer] = useState<boolean>(false);
  const openDropContainer = useCallback(() => {
    setShowDropContianer(true);
  }, []);
  const closeContainer = useCallback(() => {
    setShowDropContianer(false);
  }, []);

  const { selected } = useComponentSelected();
  const createTemplate = useCreateTemplate();
  const [showCreateTemplatePopup, setShowCreateTemplatePopup] =
    useState<boolean>(false);
  const createTempalateInputRef = useRef<HTMLInputElement>(null);
  const onCreateTemplateClickCb = useCallback(() => {
    console.log("onCreateTemplateClickCb");
    setShowCreateTemplatePopup(true);
  }, []);
  const onCreateTemplatePopupCrossClickCb = useCallback(() => {
    console.log("onCreateTemplatePopupCrossClickCb");
    setShowCreateTemplatePopup(false);
  }, []);
  const onCreateClickCb = useCallback(() => {
    if (selected && templatesData && createTempalateInputRef.current) {
      const templateEvents = createTemplate(selected);
      if (templateEvents.length > 0) {
        callCreateTeamplateApi(
          templateEvents,
          createTempalateInputRef.current.value
        );
      }
    }
    setShowCreateTemplatePopup(false);
  }, [createTemplate, selected, templatesData, callCreateTeamplateApi]);

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
        <Container name="Drop" onClose={closeContainer}>
          <div style={styles.dropContainerItem}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Select Template</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>
            <div>
              <div>
                <div
                  style={{
                    padding: "0.5rem",
                    backgroundColor: gray900,
                    ...h4Heading,
                    color: gray300,
                  }}
                >
                  User Templates
                </div>
                {templatesData?.user.names.map((name) => {
                  const formatName = name.split(/(\/|\\|\\\\)/).slice(-1)[0];
                  const onMouseDownCb = () => {
                    startDrag(
                      { comp: DragTemplateComp, props: { text: formatName } },
                      {
                        type: "template",
                        data: {
                          dir: templatesData.default.dir,
                          name: name,
                          newTemplateRootId: getId(),
                        },
                      }
                    );
                  };
                  return (
                    <div
                      key={name}
                      style={{
                        padding: "0.5rem",
                        borderBottom: `1px solid ${gray900}`,
                        ...h4Heading,
                        color: gray300,
                      }}
                      onMouseDown={onMouseDownCb}
                    >
                      {formatName}
                    </div>
                  );
                })}
              </div>
              <div>
                <div
                  style={{
                    padding: "0.5rem",
                    backgroundColor: gray900,
                    ...h4Heading,
                    color: gray300,
                  }}
                >
                  Default Templates
                </div>
                {templatesData?.default.names.map((name) => {
                  const formatName = name.split(/(\/|\\|\\\\)/).slice(-1)[0];
                  const onMouseDownCb = () => {
                    startDrag(
                      { comp: DragTemplateComp, props: { text: formatName } },
                      {
                        type: "template",
                        data: {
                          dir: templatesData.default.dir,
                          name: name,
                          newTemplateRootId: getId(),
                        },
                      }
                    );
                  };
                  return (
                    <div
                      key={name}
                      style={{
                        padding: "0.5rem",
                        borderBottom: `1px solid ${gray900}`,
                        ...h4Heading,
                        color: gray300,
                      }}
                      onMouseDown={onMouseDownCb}
                    >
                      {formatName}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      ) : null}

      {selected ? (
        <Menu name="PublishMenu">
          <div style={styles.outerDiv} onClickCapture={onCreateTemplateClickCb}>
            Create Template
            {showCreateTemplatePopup ? (
              <div
                style={{
                  position: "absolute",
                  bottom: "-9rem",
                  right: 0,
                  zIndex: 1,
                  background: gray800,
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Create Template</span>
                  <span onClickCapture={onCreateTemplatePopupCrossClickCb}>
                    <Cross />
                  </span>
                </div>
                <label htmlFor="templateName">Template Name</label>
                <input ref={createTempalateInputRef} id="templateName" />
                <button
                  style={{
                    ...h4Heading,
                    border: "none",
                    outline: "none",
                    background: amber300,
                    borderRadius: "4px",
                    color: gray900,
                    padding: "6px 0",
                    textAlign: "center",
                    width: "13rem",
                  }}
                  onClickCapture={onCreateClickCb}
                >
                  Create
                </button>
              </div>
            ) : null}
          </div>
        </Menu>
      ) : null}
    </>
  );
}
