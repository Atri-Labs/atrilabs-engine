import React, { useRef, forwardRef, useState } from "react";
import Chevron from "./Chevron";


export enum ExpandIconPosition {
  LEFT = "left",
  RIGHT = "right", 
}

export type AccordionComponentTypes = {
  title: string;
  description: string;
  open: boolean;
  disabled?: boolean;
  showIcon?: boolean;
  onTitleClick: () => void;
  className?: string;
  arrowIcon?: string;
  expandIconPosition?:ExpandIconPosition
};

const AccordionComponent: React.FC<AccordionComponentTypes> = ({
  title,
  description,
  open,
  onTitleClick,
  className,
  disabled,
  showIcon,
  arrowIcon,
  expandIconPosition,
}) => {
  const content = useRef<HTMLDivElement>(null);

  return (
    <>
      <style>
        {`.accordion-section {
            display: flex;
            flex-direction: column;
          }

          .accordion {
            background-color: #eee;
            color: #444;
            cursor: pointer;
            padding: 18px;
            display: flex;
            align-items: center;
            border: none;
            outline: none;
            transition: background-color 0.6s ease;
          }

          .accordion-section .accordion.arrowRight .accordion-title {
            margin: 0 !important;
          }
          .accordion-section .accordion.arrowRight .accordion-icon {
            order: 1;
            margin-left: auto;
          }

          .accordion:hover,
          .active {
            background-color: #ccc;
          }
          
          .accordion-title {
            font-weight: 600;
            font-size: 14px;
            text-align: left;
          }
          
          .accordion__icon {
            margin-left: auto;
            transition: transform 0.6s ease;
          }
          
          .rotate {
            transform: rotate(90deg);
          }

          .accordion-content {
            background-color: white;
            overflow: auto;
          }

          .accordion-text {
            font-weight: 400;
            font-size: 14px;
            padding: 18px;
          }

          .accordion-section.disabled .accordion{
            cursor: not-allowed !important;
          }
          .accordion-section.disabled .accordion-title,
          .accordion-section.disabled svg.accordion-icon path{
            color :rgba(0,0,0,.25);
            fill :rgba(0,0,0,.25);
          }
        `}
      </style>

      <div
        className={
          disabled
            ? "accordion-section disabled"
            : `${className ? className : ""} accordion-section`
        }
      >
        <button //arrowRight
          className={ (expandIconPosition ===ExpandIconPosition.LEFT) ? `accordion ${open ? "active " : ""}` : `accordion ${open ? "active " : ""}arrowRight`}
          onClick={() => {
            onTitleClick();
          }}
        >
          {(showIcon === true || showIcon === undefined) &&
          arrowIcon === undefined ? (
            <Chevron
              className={`${open ? "accordion-icon rotate" : "accordion-icon"}`}
              fill={"#777"}
            />
          ) : (
            (showIcon === true || showIcon === undefined) && (
              <img 
              className="accordion-icon"
                src={arrowIcon}
                alt="ArrowIcon"
                style={{ transform: open ? "" : "rotate(270deg)" }}
              />
            )
          )}
          <p className="accordion-title" style={{ marginLeft: "1rem" }}>
            {title}
          </p>
        </button>
        <div
          ref={content}
          style={{
            height: `${open ? content.current?.scrollHeight + "px" : "0px"}`,
          }}
          className="accordion-content"
        >
          <div className="accordion-text">{description}</div>
        </div>
      </div>
    </>
  );
};

type ItemDataType = {
  title: string;
  description?: string;
  open?: boolean;
  disabled?: boolean;
  showIcon?: boolean;
};

const Accordion = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: ItemDataType[];
      collapse?: boolean;
      arrowIcon?: string;
      expandIconPosition?:ExpandIconPosition
    };
    onTitleClick: (open: boolean, index: number) => void;
    className?: string;
  }
>((props, ref) => {
  const [itemClone, setItemClone] = useState(props.custom.items);

  const onTitleClickHandler = (item: ItemDataType, index: number) => {
    // if the item is disabled, return
    if (item.disabled) return;

    const itemsCopy = [...itemClone];

    if (props.custom.collapse) {
      // if the mode is collapse, so multiple div can be expanded at a time
      itemsCopy[index].open = !itemsCopy[index].open;
    } else {
      itemsCopy.forEach(
        (_item, _index) => (_item.open = _index === index && !_item.open)
      );
    }
    setItemClone(itemsCopy);
    props.onTitleClick(itemsCopy[index].open || false, index);
  };

  return (
    <div ref={ref} style={props.styles}>
      {itemClone.map((item, index) => (
        <AccordionComponent
          className={props.className}
          key={index}
          title={item.title}
          description={item.description || ""}
          arrowIcon={props.custom.arrowIcon}
          onTitleClick={() => onTitleClickHandler(item, index)}
          open={item.open || false}
          disabled={item.disabled}
          showIcon={item.showIcon}
          expandIconPosition={props.custom.expandIconPosition}
        />
      ))}
    </div>
  );
});

export default Accordion;
