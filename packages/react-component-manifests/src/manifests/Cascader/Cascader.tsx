import React, { forwardRef } from "react";
import { Cascader as AntdCascader } from "antd";

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

const Cascader = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      placeholder ?: string;
    };
    className?: string;
  }
>((props, ref) => {
  const {custom} = props;
  const options: Option[] = [
    {
      value: "zhejiang",
      label: "Zhejiang",
      children: [
        {
          value: "hangzhou",
          label: "Hangzhou",
          children: [
            {
              value: "xihu",
              label: "West Lake",
            },
          ],
        },
      ],
    },
  ];
  return (
    <div ref={ref}>
      <AntdCascader
        options={options}
        {...custom}
      />
    </div>
  );
});

export default Cascader;
