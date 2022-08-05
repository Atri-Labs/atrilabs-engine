import create from "zustand";

const useStore = create((set) => {
  return {};
});

const desktopModeProps = {
  /* DATA CURSOR */
};

const breakpointProps = {};

function getViewportDimension() {
  const width = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const height = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  return { width, height };
}

function getEffectiveBreakpointWidths(pageName, windowWidth) {
  if (breakpointProps[pageName] === undefined) {
    return [];
  }
  const widths = Object.keys(breakpointProps[pageName]);
  return widths.filter((curr) => {
    return curr >= windowWidth;
  });
}

function getEffectivePropsForPage(pageName) {
  const { width } = getViewportDimension();
  let effectiveProps = JSON.stringify(desktopModeProps[pageName]);
  const effectiveWidths = getEffectiveBreakpointWidths(pageName, width);
  effectiveWidths.forEach((effectiveWidth) => {
    effectiveProps = {
      ...effectiveProps,
      ...breakpointProps[pageName][effectiveWidth],
    };
  });
  return effectiveProps;
}

export function setEffectivePropsForPage(pageName) {
  const effectiveProps = getEffectivePropsForPage(pageName);
  useStore.setState({ [pageName]: effectiveProps });
}

useStore.setState(desktopModeProps);

export default useStore;
