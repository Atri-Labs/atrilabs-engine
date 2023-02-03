import React, { forwardRef, useCallback } from "react";

const Step = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      color: string;
      current: number;
      steps: { title: string; description: string }[];
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );

  return (
    <>
      <style>
        {`
        .step-parent {
          display: flex;
          justify-content: center;
        }
        .step-wrpter {
          display: flex;
          justify-content: center;
        }
        .step-wrapper {
          display: flex;
          flex-direction: row;
        }
        .icon-holder {
          height: 100%;
          display: flex;
          align-items: flex-start;
          padding-top: 7px;
        }
        .step-icon {
          border-radius: 50%;
          height: 40px;
          width: 40px;
          display: flex;
          color: white;
          font-size: 16px;
          align-items: center;
          justify-content: center;
        }
        .step-icon-notreached {
          border-radius: 50%;
          height: 40px;
          width: 40px;
          display: flex;
          color: #8f9598;
          border: 1px solid #8f9598;
          font-size: 16px;
          align-items: center;
          justify-content: center;
        }
        .step-details {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 15px;
        }
        .step-details-notreached {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 15px;
          color: #8f9598;
        }
        .progress-holder {
          height: 100%;
          display: flex;
          width: 100%;
          align-items: flex-start;
          padding-top: 25px;
        }
        .step-progress {
          height: 1px;
          width: 110%;
          margin-left: -5px;
          margin-right: 20px;
        }
        .step-progress-notreached {
          height: 1px;
          width: 110%;
          background-color: #8f9598;
          margin-left: -5px;
          margin-right: 20px;
        }
        .step-icon-done {
          display: inline-block;
          width: 40px;
          height: 40px;
          -ms-transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
        }
        .step-icon-done-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .step-icon-done-stem {
          position: absolute;
          width: 1px;
          height: 21px;
          background-color: green;
          left: 24px;
          top: 8px;
        }

        .step-icon-done-kick {
          position: absolute;
          width: 10px;
          height: 1px;
          background-color: green;
          left: 14px;
          top: 28px;
        }
        `}
      </style>
      <div
        ref={ref}
        style={props.styles}
        onClick={onClick}
        className={`step-parent ${props.className}`}
      >
        {props.custom.steps.map((step, i) => (
          <div
            className="step-wrapper"
            key={i}
            style={{ width: `${100 / props.custom.steps.length}%` }}
          >
            {props.custom.current > i + 1 ? (
              <div>
                <div className="icon-holder">
                  <span className="step-icon-done">
                    <div
                      style={{
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: `${props.custom.color}`,
                      }}
                      className="step-icon-done-circle"
                    ></div>
                    <div
                      style={{
                        backgroundColor: `${props.custom.color}`,
                      }}
                      className="step-icon-done-stem"
                    ></div>
                    <div
                      style={{
                        backgroundColor: `${props.custom.color}`,
                      }}
                      className="step-icon-done-kick "
                    ></div>
                  </span>
                </div>
                <div className="step-details">
                  <h5>{step.title}</h5>
                  <p>{step.description}</p>
                </div>
              </div>
            ) : props.custom.current === i + 1 ? (
              <div>
                <div className="icon-holder">
                  <div
                    className="step-icon"
                    style={{ backgroundColor: `${props.custom.color}` }}
                  >
                    {i + 1}
                  </div>
                </div>
                <div className="step-details">
                  <h5>{step.title}</h5>
                  <p>{step.description}</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="icon-holder">
                  <div className="step-icon-notreached">{i + 1}</div>
                </div>
                <div className="step-details-notreached">
                  <h5>{step.title}</h5>
                  <p>{step.description}</p>
                </div>
              </div>
            )}
            s
            {i + 1 < props.custom.steps.length &&
            i + 1 < props.custom.current ? (
              <div className="progress-holder">
                <div
                  className="step-progress"
                  style={{ backgroundColor: `${props.custom.color}` }}
                ></div>
              </div>
            ) : i + 1 < props.custom.steps.length &&
              i + 1 >= props.custom.current ? (
              <div className="progress-holder">
                <div className="step-progress-notreached"></div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
});

export default Step;
