import React, { forwardRef, ChangeEventHandler, ReactNode, useState, useRef } from "react";
import { Tabs as AntdTabs , TabsProps } from "antd";


export type TabsType = 'line' | 'card' | 'editable-card';
export type TabPosition = 'left' | 'right' | 'top' | 'bottom';
export type SizeType = 'large' | 'middle' | 'small';

const Tabs = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom?: { items?: any } ;
    onChange: (activeKey: string) => void;
    onTitleClick?: (
      activeKey: string,
      e: React.KeyboardEvent | React.MouseEvent
    ) => void;
  }& TabsProps
>((props, ref) => {
  //debugger
  const { custom, ...restProps } = props; 

///////////////

// type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

// const initialItems = [
//   {
//     key: "1",
//     label: `One`,
//     children: `Content of Tab Pane 1`,
//   },
//   {
//     key: "2",
//     label: `Two`,
//     children: `Content of Tab Pane 2`,
//   },
//   {
//     key: "3",
//     label: `Three`,
//     children: `Content of Tab Pane 3`,
//     closable: false,
//   },
// ];
// const [activeKey, setActiveKey] = useState(initialItems[0].key);
// const [items, setItems] = useState(initialItems);
// const newTabIndex = useRef(0);

// const onChange = (newActiveKey: string) => {
//   setActiveKey(newActiveKey);
// };

// const add = () => {
//   const newActiveKey = `newTab${newTabIndex.current++}`;
//   const newPanes = [...items];
//   newPanes.push({ label: 'New Tab', children: 'Content of new Tab', key: newActiveKey });
//   setItems(newPanes);
//   setActiveKey(newActiveKey);
// };

// const remove = (targetKey: TargetKey) => {
//   let newActiveKey = activeKey;
//   let lastIndex = -1;
//   items.forEach((item, i) => {
//     if (item.key === targetKey) {
//       lastIndex = i - 1;
//     }
//   });
//   const newPanes = items.filter((item) => item.key !== targetKey);
//   if (newPanes.length && newActiveKey === targetKey) {
//     if (lastIndex >= 0) {
//       newActiveKey = newPanes[lastIndex].key;
//     } else {
//       newActiveKey = newPanes[0].key;
//     }
//   }
//   setItems(newPanes);
//   setActiveKey(newActiveKey);
// };

// const onEdit = (
//   targetKey: React.MouseEvent | React.KeyboardEvent | string,
//   action: 'add' | 'remove',
// ) => {
//   if (action === 'add') {
//     add();
//   } else {
//     remove(targetKey);
//   }
// };



/////////

  return (
      <div ref={ref}  style={props.styles}>
        <AntdTabs
          className={props.className}
          items={props?.custom?.items}
          {...custom}
          {...restProps}
          onChange= {props.onChange}
          onTabClick={props.onTitleClick}               
        />
        
        {/* <AntdTabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    /> */}

      </div>
  );
});

export default Tabs;

// import React, { forwardRef, useCallback } from "react";

// const Input = forwardRef<
//   HTMLInputElement,
//   {
//     styles: React.CSSProperties;
//     custom: { value: string; placeholder: string; isPasswordField?: boolean };
//     onChange: (value: string) => void;
//     onPressEnter: () => void;
//     className?: string;
//   }
// >((props, ref) => {
//   const onChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       props.onChange(e.target.value);
//     },
//     [props]
//   );
//   const onKeyDown = useCallback(
//     (e: React.KeyboardEvent) => {
//       if (e.key === "Enter") {
//         props.onPressEnter();
//       }
//     },
//     [props]
//   );
//   return (
//     <input
//       ref={ref}
//       className={props.className}
//       style={props.styles}
//       onChange={onChange}
//       placeholder={props.custom.placeholder}
//       value={props.custom.value}
//       onKeyDown={onKeyDown}
//       type={props.custom.isPasswordField ? "password" : undefined}
//     />
//   );
// });

// export default Input;
