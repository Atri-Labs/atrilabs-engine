const IFrame = React.forwardRef((props, ref)=>{
    // Provide all options avaliable in an iframe
     return <iframe  className={props.className} ref={ref} styles={props.styles} src={props.href} srcdoc={props.srcdoc} />
   })
   
export default IFrame;