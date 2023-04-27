import React, { forwardRef, ReactNode, useState } from "react";

type allowValue =
  | "accelerometer"
  | "camera"
  | "encrypted-media"
  | "geolocation"
  | "gyroscope"
  | "microphone"
  | "midi"
  | "payment"
  | "picture-in-picture"
  | "speaker";
const Iframe = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
    custom: {
      id?: string;
      src?: string;
      title?: string;
      allow?: allowValue[];
      referrerPolicy?:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url";
      sandbox?:
        | ""
        | "allow-downloads"
        | "allow-downloads-without-user-activation"
        | "allow-forms"
        | "allow-modals"
        | "allow-orientation-lock"
        | "allow-pointer-lock"
        | "allow-popups"
        | "allow-popups-to-escape-sandbox"
        | "allow-presentation"
        | "allow-same-origin"
        | "allow-scripts"
        | "allow-storage-access-by-user-activation"
        | "allow-top-navigation"
        | "allow-top-navigation-by-user-activation"
        | "allow-top-navigation-to-custom-protocols";
      loading?: "eager" | "lazy";
    };
    className?: string;
  }
>((props, ref) => {
  const { custom } = props;
  const { allow, ...restProps } = custom;
  let allowValues = allow?.join("; ");

  return (
    <div ref={ref} id={props.attrs.id}>
      <iframe
        className={`${props.className} ${props.attrs.class}`}
        style={props.styles}
        {...restProps}
        allow={allowValues}
      />
    </div>
  );
});
export default Iframe;
