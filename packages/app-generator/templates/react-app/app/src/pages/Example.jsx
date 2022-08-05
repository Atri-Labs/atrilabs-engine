import { useLayoutEffect } from "react";
import { useEffect } from "react";
import useStore, { setEffectivePropsForPage } from "../hooks/useStore";
// IMPORT CURSOR

export default function Example() {
  useLayoutEffect(()=>{
    setEffectivePropsForPage(/* PAGE NAME 1 CURSOR */)
  }, [])

  useEffect(()=>{
    const onResize = ()=>{
      setEffectivePropsForPage(/* PAGE NAME 2 CURSOR */)
    };
    window.addEventListener("resize", onResize);
    return ()=>{
      window.removeEventListener("resize", onResize);
    }
  }, [])

  // COMPONENT CURSOR

  return (<>
  {/* JSX CURSOR */}
  </>);
}
