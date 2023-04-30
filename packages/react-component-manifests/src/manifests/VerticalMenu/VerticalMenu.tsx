import React, { forwardRef, useState } from "react";
import { ArrowDown, ArrowUp, MenuItemsMap } from "./components";

const VerticalMenu = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    custom: {
      title: string;
      menuItems: {
        name: string;
        subMenuItems?: {
          subMenuItemsName: string;
          subMenu?: {
            itemsName: string;
          }[];
        }[];
      }[];
    };
    id?: string;
    className?: string;
    onClick: (menuItem: { name: string }) => void;
  }
>((props, ref) => {
  const { title, menuItems } = props.custom;
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };
  return (
    <div
      ref={ref}
      style={{ ...props.styles, position: "relative" }}
      className={props.className}
      id={props.id}
    >
      <span
        style={{
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
          columnGap: ".25rem",
        }}
      >
        <p>{title}</p>
        <span onClick={toggleMenu}>
          {!showMenu ? <ArrowDown /> : <ArrowUp />}
        </span>
      </span>
      {/* render menu items */}
      {showMenu && (
        <main
          style={{
            marginLeft: "1.2rem",
          }}
        >
          <MenuItemsMap menuAray={menuItems} onClick={props.onClick} />
        </main>
      )}
    </div>
  );
});

export default VerticalMenu;
