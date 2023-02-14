export type ComponentCoordsWM = {
  top: number;
  left: number;
  width: number;
  height: number;
  topWM: number;
  rightWM: number;
  bottomWM: number;
  leftWM: number;
};

export function getCSSBoxCoords(elem: Element): ComponentCoordsWM {
  // crossbrowser version
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  var topWM = top - parseFloat(window.getComputedStyle(elem).marginTop);
  var leftWM = left - parseFloat(window.getComputedStyle(elem).marginLeft);
  var bottomWM =
    top + box.height + parseFloat(window.getComputedStyle(elem).marginBottom);
  var rightWM =
    left + box.width + parseFloat(window.getComputedStyle(elem).marginRight);

  return {
    top: top,
    left: left,
    width: box.width,
    height: box.height,
    topWM,
    leftWM,
    rightWM,
    bottomWM,
  };
}

export function getOverlayStyle(
  playgroundElement: Element,
  location: { pageX: number; pageY: number }
) {
  const containerCoords = getCSSBoxCoords(playgroundElement);
  const absoluteTop = location.pageY - containerCoords.top + 10;
  const absoluteLeft = location.pageX - containerCoords.left + 10;
  const style: React.CSSProperties = {
    top: absoluteTop,
    left: absoluteLeft,
    position: "absolute",
  };
  return style;
}
