import React, { forwardRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Countdown.css";
import { useCountdown } from "./useCountdown";

export type DateTimeDisplayComponentTypes = {
  value: number;
  type: string;
};

export const DateTimeDisplay: React.FC<DateTimeDisplayComponentTypes> = ({
  value,
  type,
}) => {
  return (
    <div className="countdown">
      <p>{value}</p>
      <span>{type}</span>
    </div>
  );
};

export const ExpiredNotice = () => {
  //CARE
  return (
    <div className="expired-notice">
      <span>Countdown has expired!</span>
      <p>Please select a future date and time.</p>
    </div>
  );
};
export type ShowCounterComponentTypes = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const ShowCounter: React.FC<ShowCounterComponentTypes> = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="show-counter">
      <DateTimeDisplay value={days} type={"Days"} />
      <p>:</p>
      <DateTimeDisplay value={hours} type={"Hours"} />
      <p>:</p>
      <DateTimeDisplay value={minutes} type={"Mins"} />
      <p>:</p>
      <DateTimeDisplay value={seconds} type={"Seconds"} />
    </div>
  );
};
export type CountdownTimerComponentTypes = {
  targetDate: number;
};

export const CountdownTimer: React.FC<CountdownTimerComponentTypes> = ({
  targetDate,
}) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export type CountdownAssetComponentTypes = {
  noOfDays: number;
};

export const CountdownAsset: React.FC<CountdownAssetComponentTypes> = ({
  noOfDays,
}) => {
  const dayss = noOfDays;
  const days = dayss * 24 * 60 * 60 * 1000;
  const now = new Date().getTime();
  const dateTimeAfterThreeDays = Number(now) + days;

  return (
    <div>
      <CountdownTimer targetDate={dateTimeAfterThreeDays} />
    </div>
  );
};

export const Countdown = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { days: 1 };
  }
>((props, ref) => {
  return (
    <div ref={ref} style={props.styles}>
      <CountdownAsset noOfDays={props.custom.days} />
    </div>
  );
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  backgroundOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    days: "number",
    hours: "number",
    minutes: "number",
    seconds: "number",
    frozen: "boolean",
    showDays: "boolean",
    showHours: "boolean",
    showMinutes: "boolean",
    showSeconds: "boolean",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Countdown", category: "Basics" },
  render: {
    comp: Countdown,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {},
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          days: 1,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {},
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Countdown" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Countdown", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
