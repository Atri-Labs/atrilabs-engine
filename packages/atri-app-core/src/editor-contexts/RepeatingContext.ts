import React from "react";
import { RepeatingContextData } from "../types";

export const RepeatingContext =
  React.createContext<RepeatingContextData | null>(null);
