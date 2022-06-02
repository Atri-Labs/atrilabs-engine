import React from "react";
import { DecoratorRenderer } from "./DecoratorRenderer";

export const MemoizedDecoratorRenderer = React.memo(() => {
  return <DecoratorRenderer compId="body" decoratorIndex={0} />;
});
