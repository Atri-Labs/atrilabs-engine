import React from "react";
import { DecoratorData } from "../types";

export const DecoratorContext = React.createContext<DecoratorData>({ id: "" });
