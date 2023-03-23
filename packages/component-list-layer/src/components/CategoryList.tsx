import { canvasApi } from "@atrilabs/pwa-builder-manager";
import { getId } from "@atrilabs/core";
import { gray300, gray900, smallText } from "@atrilabs/design-system";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { useCallback } from "react";
import type { DragComp, DragData } from "@atrilabs/atri-app-core";
import { CommonIcon } from "@atrilabs/atri-app-core/src/editor-components/CommonIcon";

const styles: { [key: string]: React.CSSProperties } = {
  mainContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
  },
  compContainer: {
    border: `1px solid ${gray900}`,
    padding: "1rem 0",
  },
};

export type CategoryListProps = {
  categorizedComponents: {
    [category: string]: {
      pkg: string;
      manifest: any;
      icon: React.FC<any> | null;
    }[];
  };
  categoryName: string;
};

export const CategoryList: React.FC<CategoryListProps> = (props) => {
  const startDragCb = useCallback((dragComp: DragComp, dragData: DragData) => {
    canvasApi.startDrag(dragComp, dragData);
  }, []);

  return (
    <>
      <div
        style={{
          ...smallText,
          backgroundColor: gray900,
          color: gray300,
          padding: "0.5rem",
        }}
      >
        {props.categoryName}
      </div>
      <div style={styles.mainContainer}>
        {props.categorizedComponents[props.categoryName]
          ? props.categorizedComponents[props.categoryName].map(
              (comp, index) => {
                return (
                  <div
                    style={styles.compContainer}
                    key={comp.pkg + index}
                    onMouseDown={() => {
                      startDragCb(
                        {
                          comp: comp.manifest.drag.comp,
                          props: {
                            ...comp.manifest.drag.props,
                            svg: comp.icon,
                          },
                        },
                        {
                          type: "component",
                          data: {
                            key: comp.manifest.renderSchema.meta.key,
                            pkg: comp.pkg,
                            manifestSchema: ReactComponentManifestSchemaId,
                            id: getId(),
                          },
                        }
                      );
                    }}
                  >
                    {comp.manifest.panel.comp === "CommonIcon" ? (
                      <CommonIcon
                        {...comp.manifest.panel.props}
                        svg={comp.icon}
                      />
                    ) : (
                      "Invalid Icon"
                    )}
                  </div>
                );
              }
            )
          : null}
      </div>
    </>
  );
};
