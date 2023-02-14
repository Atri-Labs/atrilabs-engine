import React, { useRef, forwardRef } from "react";
import Chevron from "./Chevron";

export type AccordionComponentTypes = {
  title: string;
  description: string;
  open: boolean;
  onTitleClick: () => void;
  className?: string;
};

const AccordionComponent: React.FC<AccordionComponentTypes> = ({
  title,
  description,
  open,
  onTitleClick,
  className,
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
        `}
      </style>
      <div className={`${className ? className : ""} accordion-section`}>
        <button
          className={`accordion ${open ? "active" : ""}`}
          onClick={() => {
            onTitleClick();
          }}
        >
          <Chevron
            className={`${open ? "accordion-icon rotate" : "accordion-icon"}`}
            fill={"#777"}
          />
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

const Accordion = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: { title: string; description?: string; open?: boolean }[];
    };
    onTitleClick: (open: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  return (
    <div ref={ref} style={props.styles}>
      {props.custom.items.map((item, index) => (
        <AccordionComponent
          className={props.className}
          key={index}
          title={item.title}
          description={item.description || ""}
          onTitleClick={() => {
            const open = item.open || false;
            item.open = !item.open;
            props.onTitleClick(open);
          }}
          open={item.open || false}
        />
      ))}
    </div>
  );
});

export default Accordion;
