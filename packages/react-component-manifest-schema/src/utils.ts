import { ComponentCoordsWM } from "./types";

export function horizontalClose(
  loc: { pageX: number; pageY: number },
  coord: ComponentCoordsWM
) {
  return loc.pageX - coord.leftWM < coord.rightWM - loc.pageX
    ? "left"
    : "right";
}

export function verticalClose(
  loc: { pageX: number; pageY: number },
  coord: ComponentCoordsWM
) {
  return loc.pageY - coord.topWM < coord.bottomWM - loc.pageY
    ? "top"
    : "bottom";
}

// =================== flex row ===========================
export function bottomWMSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    return a.bottomWM - b.bottomWM;
  });
  return coords;
}

export function detectRows(sortedCords: ComponentCoordsWM[]) {
  let currMaxY = sortedCords[0].bottomWM;
  let rows: { lastIndex: number; maxY: number }[] = [];
  for (let i = 1; i < sortedCords.length; i++) {
    const coord = sortedCords[i];
    if (coord.topWM >= currMaxY) {
      // row change has happened
      const lastIndex = i - 1;
      const maxY = currMaxY;
      rows.push({ lastIndex, maxY });
    }
    if (coord.bottomWM > currMaxY) {
      currMaxY = coord.bottomWM;
    }
  }
  rows.push({ lastIndex: sortedCords.length - 1, maxY: currMaxY });
  return rows;
}

export function leftWMSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    return a.leftWM - b.leftWM;
  });
  return coords;
}

export function isInsideRowBox(
  loc: { pageX: number; pageY: number },
  coord: ComponentCoordsWM
) {
  return loc.pageX >= coord.leftWM && loc.pageX <= coord.rightWM;
}

export function findInRow(
  loc: { pageX: number; pageY: number },
  coords: ComponentCoordsWM[]
) {
  let foundIndex = coords.length;
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    if (isInsideRowBox(loc, coord)) {
      const side = horizontalClose(loc, coord);
      if (side === "left") {
        foundIndex = i;
      } else {
        foundIndex = i + 1;
      }
      break;
    }
    if (coord.leftWM > loc.pageX) {
      foundIndex = i;
      break;
    }
  }
  return foundIndex;
}

export function flexRowSort(
  loc: { pageX: number; pageY: number },
  coords: ComponentCoordsWM[]
) {
  bottomWMSort(coords);
  const rows = detectRows(coords);
  const rowWiseCoords = rows.map((row, index) => {
    let newCoords = [];
    if (index === 0) newCoords = coords.slice(0, row.lastIndex + 1);
    else
      newCoords = coords.slice(
        rows[index - 1].lastIndex + 1,
        row.lastIndex + 1
      );
    leftWMSort(newCoords);
    return newCoords;
  });
  const rowIndex = rows.findIndex((row) => row.maxY >= loc.pageY);
  if (rowIndex < 0) {
    console.error("unexpected less than 0");
    return;
  }
  if (rowIndex === 0) {
    return findInRow(loc, rowWiseCoords[rowIndex]);
  }
  return (
    rows[rowIndex - 1].lastIndex + 1 + findInRow(loc, rowWiseCoords[rowIndex])
  );
}

// ================== flex col ==================================
export function rightWMSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    return a.rightWM - b.rightWM;
  });
  return coords;
}

export function detectCols(sortedCords: ComponentCoordsWM[]) {
  let currMaxX = sortedCords[0].rightWM;
  let cols: { lastIndex: number; maxX: number }[] = [];
  for (let i = 1; i < sortedCords.length; i++) {
    const coord = sortedCords[i];
    if (coord.leftWM >= currMaxX) {
      // row change has happened
      const lastIndex = i - 1;
      const maxX = currMaxX;
      cols.push({ lastIndex, maxX });
    }
    if (coord.rightWM > currMaxX) {
      currMaxX = coord.rightWM;
    }
  }
  cols.push({ lastIndex: sortedCords.length - 1, maxX: currMaxX });
  return cols;
}

export function topWMSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    return a.topWM - b.topWM;
  });
  return coords;
}

export function isInsideColBox(
  loc: { pageX: number; pageY: number },
  coord: ComponentCoordsWM
) {
  return loc.pageY >= coord.topWM && loc.pageY <= coord.bottomWM;
}

export function findInCol(
  loc: { pageX: number; pageY: number },
  coords: ComponentCoordsWM[]
) {
  let foundIndex = coords.length;
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    if (isInsideColBox(loc, coord)) {
      const side = verticalClose(loc, coord);
      if (side === "top") {
        foundIndex = i;
      } else {
        foundIndex = i + 1;
      }
      break;
    }
    if (coord.topWM > loc.pageY) {
      foundIndex = i;
      break;
    }
  }
  return foundIndex;
}

export function flexColSort(
  loc: { pageX: number; pageY: number },
  coords: ComponentCoordsWM[]
) {
  rightWMSort(coords);
  const cols = detectCols(coords);
  const colWiseCoords = cols.map((col, index) => {
    let newCoords = [];
    if (index === 0) newCoords = coords.slice(0, col.lastIndex + 1);
    else
      newCoords = coords.slice(
        cols[index - 1].lastIndex + 1,
        col.lastIndex + 1
      );
    topWMSort(newCoords);
    return newCoords;
  });
  const colIndex = cols.findIndex((col) => col.maxX >= loc.pageX);
  if (colIndex < 0) {
    console.error("unexpected less than 0");
    return;
  }
  if (colIndex === 0) {
    return findInCol(loc, colWiseCoords[colIndex]);
  }
  return (
    cols[colIndex - 1].lastIndex + 1 + findInCol(loc, colWiseCoords[colIndex])
  );
}

// ================ flex row reverse ====================
export function rightWMReverseSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    return b.rightWM - a.rightWM;
  });
  return coords;
}

export function findInRowRevere(
  loc: { pageX: number; pageY: number },
  coords: ComponentCoordsWM[]
) {
  let foundIndex = coords.length;
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    if (isInsideRowBox(loc, coord)) {
      const side = horizontalClose(loc, coord);
      if (side === "right") {
        foundIndex = i;
      } else {
        foundIndex = i + 1;
      }
      break;
    }
    if (coord.rightWM < loc.pageX) {
      foundIndex = i;
      break;
    }
  }
  return foundIndex;
}

export function flexRowReverseSort(
  loc: { pageX: number; pageY: number },
  coords: ComponentCoordsWM[]
) {
  bottomWMSort(coords);
  const rows = detectRows(coords);
  const rowWiseCoords = rows.map((row, index) => {
    let newCoords = [];
    if (index === 0) newCoords = coords.slice(0, row.lastIndex + 1);
    else
      newCoords = coords.slice(
        rows[index - 1].lastIndex + 1,
        row.lastIndex + 1
      );
    rightWMReverseSort(newCoords);
    return newCoords;
  });
  const rowIndex = rows.findIndex((row) => row.maxY >= loc.pageY);
  if (rowIndex < 0) {
    console.error("unexpected less than 0");
    return;
  }
  if (rowIndex === 0) {
    return findInRowRevere(loc, rowWiseCoords[rowIndex]);
  }
  return (
    rows[rowIndex - 1].lastIndex +
    1 +
    findInRowRevere(loc, rowWiseCoords[rowIndex])
  );
}

// ==================== flex col reverse =========================
export function bottomWMReverseSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    return b.bottomWM - a.bottomWM;
  });
  return coords;
}

export function findInColReverse(
  loc: { pageX: number; pageY: number },
  coords: ComponentCoordsWM[]
) {
  let foundIndex = coords.length;
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    if (isInsideColBox(loc, coord)) {
      const side = verticalClose(loc, coord);
      if (side === "bottom") {
        foundIndex = i;
      } else {
        foundIndex = i + 1;
      }
      break;
    }
    if (coord.bottomWM < loc.pageY) {
      foundIndex = i;
      break;
    }
  }
  return foundIndex;
}

export function flexColReverseSort(
  loc: { pageX: number; pageY: number },
  coords: ComponentCoordsWM[]
) {
  rightWMSort(coords);
  const cols = detectCols(coords);
  const colWiseCoords = cols.map((col, index) => {
    let newCoords = [];
    if (index === 0) newCoords = coords.slice(0, col.lastIndex + 1);
    else
      newCoords = coords.slice(
        cols[index - 1].lastIndex + 1,
        col.lastIndex + 1
      );
    bottomWMReverseSort(newCoords);
    return newCoords;
  });
  const colIndex = cols.findIndex((col) => col.maxX >= loc.pageX);
  if (colIndex < 0) {
    console.error("unexpected less than 0");
    return;
  }
  if (colIndex === 0) {
    return findInColReverse(loc, colWiseCoords[colIndex]);
  }
  return (
    cols[colIndex - 1].lastIndex +
    1 +
    findInColReverse(loc, colWiseCoords[colIndex])
  );
}
