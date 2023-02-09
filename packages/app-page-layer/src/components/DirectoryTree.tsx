import { DataNode } from "../PageTree";
import { FileView } from "./FileView";

export const DirectoryTree: React.FC<{ treeData: DataNode[] }> = (props) => {
  return (
    <div>
      {props.treeData.map((node, index) => {
        return (
          <div key={index}>
            <FileView
              name={node.title}
              route={node.route}
              isFolder={!node.isLeaf}
              isOpen={false}
            />
            {node.children && (
              <div
                key={index + " " + index}
                style={{ position: "relative", left: "1em" }}
              >
                <DirectoryTree treeData={node.children} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
