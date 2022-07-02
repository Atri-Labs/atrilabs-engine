import React from "react";
import { canvasComponentStore } from "./CanvasComponentData";
import { ComponentRenderer } from "./ComponentRenderer";
import { dudCallback } from "./utils";

export type DecoratorProps = {
  compId: string;
  // a Decorator's children is always a DecoratorRenderer
  decoratorIndex: number;
};

export type DecoratorRendererProps = {
  compId: string;
  decoratorIndex: number;
};

export const DecoratorRenderer: React.FC<DecoratorRendererProps> = (props) => {
  const FCComp = canvasComponentStore[props.compId].comp;
  const fcProps = canvasComponentStore[props.compId].props;
  const fcRef = canvasComponentStore[props.compId].ref;
  const acceptsChild = canvasComponentStore[props.compId].acceptsChild;
  const decorators = canvasComponentStore[props.compId].decorators;
  if (decorators[props.decoratorIndex]) {
    const Decorator = decorators[props.decoratorIndex]!;
    return (
      <Decorator
        compId={props.compId}
        decoratorIndex={props.decoratorIndex + 1}
      />
    );
  } else if (acceptsChild) {
    return <ComponentRenderer compId={props.compId} />;
  } else {
    const callbacks: { [callbackName: string]: () => void } = {};
    const callbackNames = Object.keys(
      canvasComponentStore[props.compId].callbacks
    );
    callbackNames.forEach((callbackName) => {
      callbacks[callbackName] = dudCallback;
    });
    return <FCComp {...fcProps} ref={fcRef} {...callbacks} />;
  }
};
