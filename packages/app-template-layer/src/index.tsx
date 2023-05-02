import React, { useCallback, useRef, useState } from "react";
import { Menu, Container, TemplateDetail } from "@atrilabs/core";
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
import "./styles.css";
import { Cross } from "./assets/Cross";
import { useTemplateApi } from "./hooks/useTemplateApi";
import { useComponentSelected } from "./hooks/useComponentSelected";
import { useCreateTemplate } from "./hooks/useCreateTemplate";
import { ConfirmDelete } from "./components/ConfirmDelete";
import { TemplateRenderer } from "./components/TemplateRenderer";
import { useShowTemplate } from "./hooks/useShowTemplate";
import { canvasApi } from "@atrilabs/pwa-builder-manager";
import { getId } from "@atrilabs/core";
import type { DragComp, DragData } from "@atrilabs/atri-app-core/src/types";

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
  const startDragCb = useCallback((dragComp: DragComp, dragData: DragData) => {
    canvasApi.startDrag(dragComp, dragData);
  }, []);

  const { templateDetails, callCreateTemplateApi, callDeleteTemplateApi } =
    useTemplateApi();
  const createTemplate = useCreateTemplate();
  const { selected } = useComponentSelected();
  const { formattedData } = useShowTemplate(templateDetails || []);
  const createTemplateInputRef = useRef<HTMLInputElement>(null);
  const [showDropPanel, setShowDropContainer] = useState<boolean>(false);
  const [showCreateTemplatePopup, setShowCreateTemplatePopup] =
    useState<boolean>(false);

  const onCreateTemplatePopupCrossClickCb = useCallback(() => {
    setShowCreateTemplatePopup(false);
  }, []);

  const openDropContainer = useCallback(() => {
    setShowDropContainer(true);
  }, []);

  const closeContainer = useCallback(() => {
    setShowDropContainer(false);
  }, []);

  const onCreateTemplateClickCb = useCallback(() => {
    setShowCreateTemplatePopup(true);
  }, []);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState<TemplateDetail | null>(null);

  const onDeleteConfirm = useCallback(() => {
    if (showDeleteDialog) callDeleteTemplateApi(showDeleteDialog);
    setShowDeleteDialog(null);
  }, [showDeleteDialog, callDeleteTemplateApi]);

  const onDeleteCancel = useCallback(() => {
    setShowDeleteDialog(null);
  }, []);

  const onCreateClickCb = useCallback(() => {
    if (selected && createTemplateInputRef.current) {
      const templateEvents = createTemplate(selected, {
        copyCallbacks: true,
        copyDefaultCallbacks: false,
      });
      if (templateEvents.length > 0) {
        callCreateTemplateApi(templateEvents, {
          templateName: createTemplateInputRef.current.value,
        });
      }
    }
    setShowCreateTemplatePopup(false);
  }, [createTemplate, selected, templateDetails, callCreateTemplateApi]);

  return (
    <>
      <Menu name="PageMenu" order={1}>
        <div
          style={styles.iconContainer}
          data-tooltip="Template Manager"
          className="tool-tip"
        >
          <IconMenu onClick={openDropContainer} active={false}>
            <OpenTemplateIcon />
          </IconMenu>
        </div>
      </Menu>
      {/*DropPanel*/}
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
              <div
                style={{
                  rowGap: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <>
                  <div
                    style={{
                      backgroundColor: gray900,
                      ...h4Heading,
                      color: gray300,
                    }}
                  ></div>
                  {formattedData.map(({ name, components, events }) => {
                    const onMouseDown = (e: React.MouseEvent) => {
                      // CARE
                      e.preventDefault();
                      e.stopPropagation();
                      startDragCb(
                        {
                          comp: "CommonIcon",
                          props: {
                            name: name.replace(".template.json", ""),
                            containerStyle: { padding: "1rem" },
                          },
                        },
                        {
                          type: "template",
                          data: {
                            name: name.replace(".template.json", ""),
                            newTemplateRootId: getId(),
                            events: events,
                          },
                        }
                      );
                    };

                    return (
                      <div
                        key={name}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <TemplateRenderer
                          templateName={name}
                          templateComponents={components}
                          styles={{ height: "" }}
                          onDeleteClicked={() => {
                            setShowDeleteDialog({
                              templateName: name,
                            });
                          }}
                          onMouseDown={onMouseDown}
                        />
                      </div>
                    );
                  })}
                </>
              </div>
            </div>
          </div>
        </Container>
      ) : null}
      {/* Create Template*/}
      {selected ? (
        <Menu name="PublishMenu" order={0}>
          <div
            style={styles.outerDiv}
            onClickCapture={onCreateTemplateClickCb}
            data-tooltip="Create Template"
            className="tool-tip"
          >
            Create Template
            {showCreateTemplatePopup ? (
              <div
                style={{
                  position: "absolute",
                  top: "2.5rem",
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
                <input ref={createTemplateInputRef} id="templateName" />
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
      {showDeleteDialog ? (
        <Container name="OverlayContainer" onClose={onDeleteCancel}>
          <ConfirmDelete
            templateName={showDeleteDialog.templateName}
            onCancel={onDeleteCancel}
            onDelete={onDeleteConfirm}
            onCross={onDeleteCancel}
          />
        </Container>
      ) : null}
    </>
  );
}
