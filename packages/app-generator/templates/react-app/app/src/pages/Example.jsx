import { useLayoutEffect, useEffect } from "react";
import useStore, { setEffectivePropsForPage } from "../hooks/useStore";
import useIoStore from "../hooks/useIoStore";
import { useNavigate } from "react-router-dom";
import { subscribeInternalNavigation } from "../utils/navigate";
// IMPORT CURSOR

export default function Example() {
  const navigate = useNavigate();
  useEffect(() => {
    const unsub = subscribeInternalNavigation((url) => {
      navigate(url, { replace: true });
    });
    return unsub;
  }, [navigate]);

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
