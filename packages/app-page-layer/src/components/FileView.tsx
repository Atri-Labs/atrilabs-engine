import { gray400, smallText } from "@atrilabs/design-system";
import { useMemo } from "react";

type FileViewTypes = {
  name: string;
  route: string;
  isFolder: boolean;
  path: number[];
  currSelectedPath: number[];
  isOpen?: boolean;
  onSelect: (route: string, isFolder: boolean, path: number[]) => void;
};

const folderOpenSvg = (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="folder-open"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 00-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z"></path>
  </svg>
);

const folderClosedSvg = (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="folder"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z"></path>
  </svg>
);

const fileSvg = (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="file"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"></path>
  </svg>
);

export const FileView: React.FC<FileViewTypes> = (props) => {
  const svgIcon = useMemo(() => {
    if (props.isFolder && props.isOpen) return folderOpenSvg;
    else if (props.isFolder && !props.isOpen) return folderClosedSvg;
    else if (!props.isFolder) return fileSvg;
  }, [props.isFolder, props.isOpen]);

  return (
    <div
      style={{
        display: "flex",
        columnGap: "0.5em",
        paddingTop: "0.35em",
        paddingLeft: "0.35em",
        paddingBottom: "0.35em",
        justifyContent: "flex-start",
        ...smallText,
        color: props.path === props.currSelectedPath ? "#fff" : gray400,
      }}
      onClick={() => {
        props.onSelect(props.route, props.isFolder, props.path);
      }}
    >
      <span style={{ display: "flex" }}>{svgIcon}</span>
      <div style={{ margin: "0" }}>{props.name}</div>
    </div>
  );
};
