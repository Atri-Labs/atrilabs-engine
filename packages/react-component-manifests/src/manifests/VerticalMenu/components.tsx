// ----------------------- ICONS-----------------------------------------------
export const ArrowDown: React.FC = () => {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.41 0L6 4.58L10.59 0L12 1.41L6 7.41L0 1.41L1.41 0Z"
        fill="black"
      />
    </svg>
  );
};
export const ArrowUp: React.FC = () => {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.59 7.41L6 2.83L1.41 7.41L-1.23266e-07 6L6 4.33923e-06L12 6L10.59 7.41Z"
        fill="black"
      />
    </svg>
  );
};
// -------------------------------------------------------------------------------------
// ----------------------------- FUNCTIONAL COMPOENENTS-----------------------------------
export const MenuItemsMap: React.FC<MenuItemsMapProp> = ({ menuAray }) => {
  const content = menuAray.map((element) => {
    return (
      <div key={element.name}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: ".25rem",
          }}
        >
          {element.name}
          {element.subMenuItems && <ArrowUp />}
        </span>
        {element.subMenuItems?.map((element) => {
          return (
            <div key={element.subMenuItemsName}>{element.subMenuItemsName}</div>
          );
        })}
      </div>
    );
  });
  return <>{content}</>;
};
interface MenuItemsMapProp {
  menuAray: { name: string; subMenuItems?: { subMenuItemsName: string }[] }[];
}
// -------------------------------------------------------------------------------------
