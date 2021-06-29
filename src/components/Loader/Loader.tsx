import { LOADER_TYPES } from "@enums/loader-types.enum";
import { ReactElement } from "react";

export default function Loader(props: any) {
  const {
    type = LOADER_TYPES.SPINNER,
    isLoading,
    numRows,
    numCols,
    rowWidth,
    rowHeight = 20
  } = props;

  const renderBlocks = (rows: number, cols: number): ReactElement[] => {
    let blocks = [];
    let items = [];
    let k = 0;
    for (let i = 0; i < cols; i++) {
      items = [];
      for (let j = 0; j < rows; j++) {
        items.push(
          <div
            key={k}
            className="skeleton-item"
            style={{
              height: getRowHeight(i, j, rowHeight),
              width: getRowWidth(i, j, rowWidth),
              margin: getRowMargin(i, j)
            }}
          />
        );
        k++;
      }
      blocks.push(
        <div
          key={i}
          className="skeleton-block"
          style={{
            alignItems: i > 0 ? 'flex-end' : 'flex-start'
          }}>
          {[...items]}
        </div>)
    }
    return [...blocks];
  };

  const getRowWidth = (row: number, col: number, val: number): string => {
    return `${val - 10 * col + row}%`;
  };

  const getRowHeight = (row: number, col: number, val: number): string => {
    if (row > 0) {
      return `${val - 5}px`;
    }
    return `${val}px`;
  };

  const getRowMargin = (row: number, col: number, val: number = 16): string => {
    if (row > 0) {
      return `${val}px 0 ${val - 8}px`;
    }
    return `${val}px 0 ${val}px`;
  };


  return isLoading ? (
    <div className={`${type}-loader-wrapper`}>
      <div
        className={type}
        aria-busy="true">
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
