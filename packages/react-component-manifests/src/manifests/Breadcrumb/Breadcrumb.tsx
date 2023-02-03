import React, { forwardRef, useCallback } from "react";

const Breadcrumb = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      divider: string;
      items: {
        // this will be visible
        name: string;
        // link
        link: string;
      }[];
    };
    className?: string;
    onClick: (item: { name: string; link: string }) => {};
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      console.log(props);
    },
    [props]
  );
  const { divider, items } = props.custom;
  const contnet = items.map((element, index) => {
    return (
      <span key={element.name + index}>
        <span>{element.name}</span>
        {/* skip divider on the last element */}
        <span style={{ margin: "0 0.25rem" }}>
          {index !== items.length - 1 ? divider : ""}
        </span>
      </span>
    );
  });
  return (
    <div
      ref={ref}
      className={props.className}
      style={props.styles}
      onClick={onClick}
    >
      {contnet}
    </div>
  );
});

export default Breadcrumb;
