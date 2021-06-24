import { LOADER_TYPES } from "@enums/loader-types.enum";
import { ReactElement } from "react";

export default function Loader(props: any) {
  const {
    type = LOADER_TYPES.SPINNER,
    isLoading,
    numRows,
    numCols,
    maxRowWidth = 100,
    minRowWidth = 75,
    rowWidth,
    rowHeight = 20,
    contentMargin = 30,
    maintainRowWidth = false
  } = props;

  const renderBlocks = (rows: number, cols: number): ReactElement[] => {
    let blocks = [];
    let k = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        blocks.push(
          <rect
            key={k}
            x={getRowX(i, j)}
            y={getRowY(i, j)}
            width={maintainRowWidth ? rowWidth : getRowWidth(i, j, rowWidth)}
            height={getRowHeight(i, j, rowHeight)}
            style={{
              fill: "black",
              fillOpacity: 0.5,
            }}
          />
        );
        k++;
      }
    }
    return [...blocks];
  };

  const getRowHeight = (
    row: number,
    col: number,
    defaultVal: number
  ): number => {
    if (row > 0) {
      return defaultVal - 5;
    }
    return defaultVal;
  };

  const getRowWidth = (
    row: number,
    col: number,
    defaultVal: number | string
  ): any => {
    let val: number;
    if (typeof defaultVal === 'string') {
      val = parseInt(defaultVal.replace('%', ''));
    }  else val = defaultVal;
    return `${val - 4 * col + row}%`;
  };


  const getRowY = ( row: number,
    col: number): number => {
      if (row > 0) {
        return col * 40;
      }
      return col * 50;
  }

  const getRowX =( row: number,
    col: number): number => {
      return row * 100 + row * maxRowWidth;
  }

  
  return isLoading ? (
    <div className={`${type}-loader-wrapper`}>
      <div className={type} aria-busy="true">
        {type === LOADER_TYPES.SKELETON ? (
          <svg id="mask" style={{ width: "100%", margin: contentMargin }}>
            <g style={{ opacity: "0.5" }}>{renderBlocks(numRows, numCols)}</g>
          </svg>
        ) : null}
      </div>
    </div>
  ) : null;
}
