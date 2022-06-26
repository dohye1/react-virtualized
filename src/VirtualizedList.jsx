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

export default function VirtualizedList() {
  const dataRef = useRef(loadMoreData(0));
  const [cache] = useState(
    new CellMeasurerCache({ fixedWidth: true, defaultHeight: 600 })
  );

  const RenderRow = useCallback(
    ({ key, index, style, parent }) => {
      const data = dataRef.current[index];
      return (
        <CellMeasurer
          key={key}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
          cache={cache}
        >
          <div className="cell" style={style}>
            {data.name}
            <div style={{ height: `${data.height * 10}px` }} />
          </div>
        </CellMeasurer>
      );
    },
    [dataRef.current]
  );

  return (
    <div className="container">
      <AutoSizer>
        {({ width, height }) => {
          return (
            <List
              width={width}
              height={height}
              rowCount={40}
              rowHeight={({ index }) => {
                return cache.rowHeight({ index });
              }}
              deferredMeasurementCache={cache}
              direction="vertical"
              rowRenderer={RenderRow}
            />
          );
        }}
      </AutoSizer>
    </div>
  );
}
