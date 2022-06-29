import { useState, useCallback, useRef } from "react";
import {
  AutoSizer,
  List,
  InfiniteLoader,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import loadMoreData from "./makeData";
import "./VirtualizedList.css";

const size = 30;

export default function VirtualizedList() {
  const curIndex = useRef(1);
  const isFetching = useRef(false);
  const [data, setData] = useState(loadMoreData(0));
  const [cache] = useState(
    new CellMeasurerCache({ fixedWidth: true, defaultHeight: 600 })
  );

  const loadMoreRows = ({ startIndex, stopIndex }) => {
    if (!isFetching.current && stopIndex > curIndex.current * size) {
      console.log("LOADING", startIndex, stopIndex, curIndex.current);
      isFetching.current = true;

      setData([...data, ...loadMoreData(curIndex.current)]);
      curIndex.current = curIndex.current + 1;
      isFetching.current = false;
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }
  };

  const RenderRow = useCallback(
    ({ key, index, style, parent }) => {
      const rowData = data[index];

      return (
        <CellMeasurer
          key={key}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
          cache={cache}
        >
          {rowData ? (
            <div className="cell" style={style}>
              {rowData.name}
              <div style={{ height: `${rowData.height * 10}px` }} />
            </div>
          ) : (
            <div className="cell" style={style}>
              Loading...
            </div>
          )}
        </CellMeasurer>
      );
    },
    [data, cache]
  );

  if (!data.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <AutoSizer>
        {({ width, height }) => {
          return (
            <InfiniteLoader
              isRowLoaded={(param) => {
                return false;
              }}
              rowCount={100}
              loadMoreRows={loadMoreRows}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={100}
                  rowHeight={({ index }) => {
                    return cache.rowHeight({ index });
                  }}
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  deferredMeasurementCache={cache}
                  direction="vertical"
                  rowRenderer={RenderRow}
                />
              )}
            </InfiniteLoader>
          );
        }}
      </AutoSizer>
    </div>
  );
}
