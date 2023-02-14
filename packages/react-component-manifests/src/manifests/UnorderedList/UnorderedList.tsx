import React, { forwardRef, useCallback } from "react";

type Item = {
  title: string;
  description?: string;
  icon?: string;
};

const UnorderedList = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      //The list-style-type for the list
      type: string;
      titleColor: string;
      descriptionColor?: string;
      //Title of the list
      items: Item[];
    };
    onClick: (event: { item: Item; index: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (item: Item, index: number) => {
      props.onClick({ item, index });
    },
    [props]
  );
  return (
    <div ref={ref} className={props.className} style={{ ...props.styles }}>
      <ul style={{ listStyle: props.custom.type }}>
        {props.custom.items.map((item, index) => {
          return (
            <li
              style={{
                padding: "0.5em 0",
                borderBottom: "1px solid rgba(0,0,0,.06)",
              }}
              onClick={() => {
                onClick(item, index);
              }}
              key={index}
            >
              <div style={{ display: "flex", columnGap: "0.5em" }}>
                <div>
                  {item.icon && (
                    <img src={item.icon} alt="Element icon" height="32em" />
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "0.5em",
                  }}
                >
                  <h4
                    style={{
                      color: props.custom.titleColor,
                      fontSize: "1em",
                    }}
                  >
                    {item.title}
                  </h4>
                  {item.description && (
                    <p
                      style={{
                        color: props.custom.descriptionColor,
                        fontSize: "1em",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default UnorderedList;
