import { DataNode } from "../PageTree";
import { FileView } from "./FileView";

type DirectoryTreeTypes = {
  treeData: DataNode[];
  padding: number;
  currSelectedPath: number[];
  onSelect: (route: string, isFolder: boolean, path: number[]) => void;
};

export const DirectoryTree: React.FC<DirectoryTreeTypes> = (props) => {
  return (
    <>
      <style>
        {`.file-view:hover {
            background-color: #4D5A68;
          }
        `}
      </style>
      <div>
        {props.treeData.map((node, index) => {
          return (
            <div key={index}>
              <div
                className="file-view"
                style={{
                  paddingLeft: `${props.padding}em`,
                  backgroundColor:
                    node.path === props.currSelectedPath ? "#6B7E9E" : "",
                }}
              >
                <FileView
                  route={node.route}
                  isFolder={!node.isLeaf}
                  isOpen={node.isFolderOpen}
                  path={node.path}
                  currSelectedPath={props.currSelectedPath}
                  onSelect={props.onSelect}
                />
              </div>
              {node.children && node.isFolderOpen && (
                <div key={index + " " + index}>
                  <DirectoryTree
                    padding={props.padding + 1}
                    treeData={node.children}
                    onSelect={props.onSelect}
                    currSelectedPath={props.currSelectedPath}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
