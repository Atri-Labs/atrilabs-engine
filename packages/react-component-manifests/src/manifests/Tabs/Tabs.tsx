import * as React from "react";
import { useRef, forwardRef, useState, useMemo } from "react";

type ItemDataType = {
  label: string;
  children: React.ReactNode;
};

interface TabHeaderProps {
  items: ItemDataType[];
  activeTab: number;
  activeTabHandler: (tabIndex: number) => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({
  items,
  activeTab,
  activeTabHandler,
}) => (
  <div className="tabs">
    {items?.map((child, index) => (
      <button
        className={activeTab === index ? "active" : ""}
        key={index}
        onClick={() => activeTabHandler(index)}
      >
        {child.label}{" "}
      </button>
    ))}
  </div>
);

interface TabsContentProps {
  activeTabData: ItemDataType;
}

const TabsContent: React.FC<TabsContentProps> = ({ activeTabData }) => (
  <div className="tab-discription">{activeTabData.children}</div>
);

const Tabs = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: ItemDataType[];
    };
    onTabChange: (activeTab: number) => void;
    className?: string;
  }
>((props, ref) => {
  const [activeTab, setActiveTab] = useState(0);

  const activeTabHandler = (tabIndex: number) => {
    setActiveTab(tabIndex);
    if (props.onTabChange) {
      props.onTabChange(tabIndex);
    }
  };

  const items = useMemo(() => {
    if (props.custom?.items?.length !== 0)
      return [
        {
          label: "Title1",
          children: <p>Description will appear here 1.</p>,
        },
        {
          label: "Title2",
          children: <p>Description will appear here 2.</p>,
        },
        {
          label: "Title3",
          children: <p>Description will appear here 3.</p>,
        },
      ];
    return props.custom.items;
  }, [props.custom.items]);

  return (
    <>
      <style>
        {`.tab-container {
            margin: 15px;
          } 
          .tabs {
            
            border-bottom: 1px solid rgba(5,5,5,.06);
            margin-bottom: 10px;
        }
        .tabs button{
            appearance: none;
            box-shadow: none;
            border: none;
            font-size: 18px;
            margin-right: 25px;
            background: transparent;
            transition: all 0.3s;
            border-bottom: 2px solid transparent;
            padding-bottom: 6px;
          }
          .tabs button.active {
            border-color: #1677ff;
        }
          .tabs button.active,
          .tabs button:hover {
            color: #1677ff;
            text-shadow: 0 0 .25px currentcolor;
        }
          .rotate {
            transform: rotate(90deg);
          }
        `}
      </style>
      {/* <div ref={ref} style={props.styles}> */}
      <div className="tab-container">
        <TabHeader
          items={props.custom.items || items}
          activeTab={activeTab}
          activeTabHandler={activeTabHandler}
        />
        <TabsContent activeTabData={items[activeTab]} />
      </div>
      {/* </div> */}
    </>
  );
});

export default Tabs;

// import { forwardRef, useMemo } from "react";
// import Tabs from "./Tabs";

// const DevTabs = forwardRef<
//   HTMLDivElement,
//   {
//     styles: React.CSSProperties;
//     custom: {
//       items: { label: string; content?: string; isActive: boolean }[];
//     };
//     onTitleClick: (open: boolean, index: number) => void;
//     className?: string;
//   }
// >((props, ref) => {
//   const items = useMemo(() => {
//     if (props.custom?.items?.length === 0)
//       return [
//         {
//           label: "Title",
//           content: "Description will appear here1.",
//         },
//         {
//           label: "Title2",
//           content: "Description will appear here2.",
//         },
//         {
//           label: "Title3",
//           content: "Description will appear here3.",
//         },
//       ];
//     return props.custom.items;
//   }, [props.custom.items]);

//   return (
//     <>
//     <Tabs
//       {...props}
//       custom={{
//         items: items,
//       }}
//       ref={ref}
//     />
//     </>
//   );
// });

// export default DevTabs;
