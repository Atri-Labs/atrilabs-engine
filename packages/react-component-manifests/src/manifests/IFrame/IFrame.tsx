import React from "react";

const IFrame = React.forwardRef((props: any, ref) => {
const frame = React.useRef<HTMLIFrameElement>(null)
 // Provide all options avaliable in an iframe
  return <iframe  className={props.className} ref={frame} style={props.style} src={props.href} sandbox={props.sandbox}  referrerPolicy={props.referrerPolicy} srcDoc={props.srcDoc} title={props.title} width={props.width} height={props.height} hidden={props.hidden} allow={props.allow} about={props.about} loading={props.loading} name={props.name}/>
})

export default IFrame;