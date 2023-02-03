import React, { forwardRef } from "react";
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
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  className?: string;
};

export const ShowCounter: React.FC<ShowCounterComponentTypes> = ({
  days,
  hours,
  minutes,
  seconds,
  showDays,
  showHours,
  showMinutes,
  showSeconds,
  className,
}) => {
  return (
    <>
      <style>
        {`
        .expired-notice {
          text-align: center;
          padding: 2rem;
          border: 1px solid #ebebeb;
          border-radius: 0.25rem;
          margin: 0.5rem;
        }
        
        .expired-notice > span {
          font-size: 2.5rem;
          font-weight: bold;
          color: red;
        }
        
        .expired-notice > p {
          font-size: 1.5rem;
        }
        
        .show-counter {
          padding: 0.5rem;
          display: flex;
        }
        
        .show-counter .countdown-link {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          font-weight: 700;
          font-size: 1.25rem;
          line-height: 1.75rem;
          padding: 0.5rem;
          border: 1px solid #ebebeb;
          border-radius: 0.25rem;
          text-decoration: none;
          color: #000;
        }
        
        .show-counter .countdown {
          line-height: 1.25rem;
          padding: 0 0.75rem 0 0.75rem;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
        
        .show-counter .countdown.danger {
          color: #ff0000;
        }
        
        .show-counter .countdown > p {
          margin: 0;
        }
        
        .show-counter .countdown > span {
          text-transform: uppercase;
          font-size: 0.75rem;
          line-height: 1rem;
        }`}
      </style>
      <div
        className={`show-counter ${className ? className : ""}`}
        style={{ display: "inline-flex" }}
      >
        {showDays && (
          <div style={{ display: "flex" }}>
            <DateTimeDisplay value={days} type={"Days"} />
          </div>
        )}
        <div
          style={
            showDays === false ||
            (showHours === false &&
              showMinutes === false &&
              showSeconds === false)
              ? { display: "none" }
              : { display: "flex" }
          }
        >
          <p>:</p>
        </div>
        {showHours && (
          <div style={{ display: "flex" }}>
            <DateTimeDisplay value={hours} type={"Hours"} />
          </div>
        )}
        <div
          style={
            showHours === false ||
            (showMinutes === false && showSeconds === false)
              ? { display: "none" }
              : { display: "flex" }
          }
        >
          <p>:</p>
        </div>
        {showMinutes && (
          <div style={{ display: "flex" }}>
            <DateTimeDisplay value={minutes} type={"Mins"} />
          </div>
        )}
        <div
          style={
            showMinutes === false || showSeconds === false
              ? { display: "none" }
              : { display: "flex" }
          }
        >
          <p>:</p>
        </div>
        {showSeconds && (
          <div style={{ display: "flex" }}>
            <DateTimeDisplay value={seconds} type={"Seconds"} />
          </div>
        )}
      </div>
    </>
  );
};
export type CountdownTimerComponentTypes = {
  isFrozen: boolean;
  targetDate: number;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  className?: string;
};

export const CountdownTimer: React.FC<CountdownTimerComponentTypes> = ({
  isFrozen,
  targetDate,
  showDays,
  showHours,
  showMinutes,
  showSeconds,
  className,
}) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate, isFrozen);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        className={className}
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        showDays={showDays}
        showHours={showHours}
        showMinutes={showMinutes}
        showSeconds={showSeconds}
      />
    );
  }
};

export type CountdownAssetComponentTypes = {
  isFrozen: boolean;
  noOfDays: number;
  noOfHours: number;
  noOfMinutes: number;
  noOfSeconds: number;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  className?: string;
};

export const CountdownAsset: React.FC<CountdownAssetComponentTypes> = ({
  isFrozen,
  noOfDays,
  noOfHours,
  noOfMinutes,
  noOfSeconds,
  showDays,
  showHours,
  showMinutes,
  showSeconds,
  className,
}) => {
  const days = noOfDays * 24 * 60 * 60 * 1000;
  const hours = noOfHours * 60 * 60 * 1000;
  const minutes = noOfMinutes * 60 * 1000;
  const seconds = noOfSeconds * 1000;
  const now = new Date().getTime();
  const dateTimeAfterGivenTime = Number(now) + days + hours + minutes + seconds;

  return (
    <CountdownTimer
      className={className}
      isFrozen={isFrozen}
      targetDate={dateTimeAfterGivenTime}
      showDays={showDays}
      showHours={showHours}
      showMinutes={showMinutes}
      showSeconds={showSeconds}
    />
  );
};

export type CountdownProps = {
  styles: React.CSSProperties;
  custom: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    frozen: boolean;
    showDays: boolean;
    showHours: boolean;
    showMinutes: boolean;
    showSeconds: boolean;
  };
  className?: string;
};

export const Countdown = forwardRef<HTMLDivElement, CountdownProps>(
  (props, ref) => {
    return (
      <div ref={ref} style={{ display: "inline-flex", ...props.styles }}>
        <CountdownAsset
          isFrozen={props.custom.frozen}
          noOfDays={props.custom.days}
          noOfHours={props.custom.hours}
          noOfMinutes={props.custom.minutes}
          noOfSeconds={props.custom.seconds}
          showDays={props.custom.showDays}
          showHours={props.custom.showHours}
          showMinutes={props.custom.showMinutes}
          showSeconds={props.custom.showSeconds}
          className={props.className}
        />
      </div>
    );
  }
);

export default Countdown;
