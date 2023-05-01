import React, { forwardRef, useCallback } from "react";

export type ToggleComponentTypes = {
  isOn: boolean;
  onColor: string;
  offColor: string;
  handleToggle: any;
};

export const ToggleHelper: React.FC<ToggleComponentTypes> = ({
  isOn,
  onColor,
  offColor,
  handleToggle,
}) => {
  return (
    <>
      <style>
        {`.toggle-holder {
            width: 100%;
            height: 100%;
          }
          .toggle-switch-checkbox {
            height: 0;
            width: 0;
            visibility: hidden;
          }
          
          .toggle-switch-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            width: 100%;
            height: 100%;
            background: grey;
            border-radius: 100px;
            position: relative;
            transition: background-color 0.2s;
          }
          
          .toggle-switch-label .toggle-switch-button {
            position: absolute;
            top: 5%;
            left: 4px;
            width: 45%;
            height: 90%;
            border-radius: 50%;
            transition: 0.2s;
            background: #fff;
          }
          
          .toggle-switch-checkbox:checked + .toggle-switch-label .toggle-switch-button {
            left: calc(100% - 4px);
            transform: translateX(-100%);
          }
          
          .toggle-switch-label:active .toggle-switch-button {
            width: 40%;
          }

          `}
      </style>
      <div className="toggle-holder">
        <input
          checked={isOn}
          onChange={handleToggle}
          className="toggle-switch-checkbox"
          id="toggle-switch-new"
          type="checkbox"
        />
        <label
          style={
            isOn ? { background: `${onColor}` } : { background: `${offColor}` }
          }
          className="toggle-switch-label"
          htmlFor="toggle-switch-new"
        >
          <span className="toggle-switch-button" />
        </label>
      </div>
    </>
  );
};

const Toggle = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    custom: { active: boolean; activeColor: string; inactiveColor: string };
    onChange: (checked: boolean) => void;
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      props.onChange(e.target.checked);
    },
    [props]
  );
  return (
    <div
      ref={ref}
      style={{ ...props.styles, display: "inline-flex" }}
      className={props.className}
      id={props.id}
    >
      <ToggleHelper
        isOn={props.custom.active}
        onColor={props.custom.activeColor}
        offColor={props.custom.inactiveColor}
        handleToggle={handleChange}
      />
    </div>
  );
});

export default Toggle;
