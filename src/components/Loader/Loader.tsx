import { LOADER_TYPES } from "@enums/loader-types.enum";
import { LoadingContext } from "@providers/LoadingContext";
import { useContext } from "react";
import { ReactElement } from "react";

export default function Loader(props: any) {
  const [, , skeletonProps, setSkeletonProps] = useContext(LoadingContext);
  const {
    type = LOADER_TYPES.SPINNER,
    isLoading,
    numRows,
    numCols,
    maxRowWidth = 100,
    minRowWidth = 75,
    rowWidth,
    rowHeight = 20,
    contentMargin = 28,
  } = props;

  const renderBlocks = (rows: number, cols: number): ReactElement[] => {
    let blocks = [];
    let k = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        blocks.push(
          <rect
            key={k}
            x={i * 100 + i * maxRowWidth}
            y={j * 50}
            width={rowWidth || getRowWidth(minRowWidth, maxRowWidth)}
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

  const getRowWidth = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
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
