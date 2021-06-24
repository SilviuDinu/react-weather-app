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
    let items = [];
    let k = 0;
    for (let i = 0; i < rows; i++) {
      items = [];
      for (let j = 0; j < cols; j++) {
        items.push(
          <div
            key={k}
            className="skeleton-item"
            style={{
              backgroundColor: "#4a545e",
              height: rowHeight,
              width: getRowWidth(i, j, rowWidth)
            }}
          />
        );
        k++;
      }
      blocks.push(
        <div
          key={i}
          className="skeleton-block">
          {[...items]}
        </div>)
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
    } else val = defaultVal;
    return `${val - 10 * col + row}%`;
  };


  return isLoading ? (
    <div className={`${type}-loader-wrapper`}>
      <div className={type} aria-busy="true">
        {type === LOADER_TYPES.SKELETON ? (
          <div className="skeleton-mask">
            <div className="skeleton-content">
              {renderBlocks(numRows, numCols)}
            </div>
            <div
              className="skeleton-expand" style={{
                width: '100%',
                height: 'auto'
              }}>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
}
