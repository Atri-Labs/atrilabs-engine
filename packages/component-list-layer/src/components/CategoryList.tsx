import { startDrag } from "@atrilabs/canvas-runtime";
import { getId } from "@atrilabs/core";
import { gray300, gray900, smallText } from "@atrilabs/design-system";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { useCallback } from "react";

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
      component: any;
    }[];
  };
  categoryName: string;
};

export const CategoryList: React.FC<CategoryListProps> = (props) => {
  const startDragCb = useCallback((...args: Parameters<typeof startDrag>) => {
    startDrag(...args);
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
                      startDragCb(comp.component.drag, {
                        type: "component",
                        data: {
                          key: comp.component.renderSchema.meta.key,
                          pkg: comp.pkg,
                          manifestSchema: ReactComponentManifestSchemaId,
                          id: getId(),
                        },
                      });
                    }}
                  >
                    <comp.component.panel.comp
                      {...comp.component.panel.props}
                    />
                  </div>
                );
              }
            )
          : null}
      </div>
    </>
  );
};
