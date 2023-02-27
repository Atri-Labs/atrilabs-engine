import React, { forwardRef, useCallback } from "react";
import { Checkbox as AntdCheckbox, Form,InputRef } from "antd";

const Checkbox = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { checked: boolean; options?: any; label: string[] };
    onChange: (checked: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  console.log(ref, "reffffffffff")
  return (
      <AntdCheckbox
        ref={(node: InputRef) => {
          console.log("checkbox",node)
          if (typeof ref === "function") {
            ref(node?.input || null);
          } else if (ref) {
            ref.current = node?.input || null;
          }
        }}
        className={props.className}
        style={props.styles}
        checked={props.custom.checked} 
      >
          {props.custom.label ? props.custom.label : "label"}
      </AntdCheckbox>
  );
});

export default Checkbox;

// import React, { forwardRef, useCallback } from "react";

// const Checkbox = forwardRef<
//   HTMLInputElement,
//   {
//     styles: React.CSSProperties;
//     custom: { checked: boolean };
//     onChange: (checked: boolean) => void;
//     className?: string;
//   }
// >((props, ref) => {
//   console.log(ref, "reffffffffff")
//   const onChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       props.onChange(e.target.checked);
//     },
//     [props]
//   );
//   return (
//     <input
//       ref={ref}
//       className={props.className}
//       style={props.styles}
//       onChange={onChange}
//       type={"checkbox"}
//       checked={props.custom.checked}
//     />
//   );
// });

// export default Checkbox;