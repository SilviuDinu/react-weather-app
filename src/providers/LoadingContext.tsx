import { Loading } from "@models/loading";
import { createContext, useState } from "react";

export const LoadingProvider = (props: any): any => {
  const [loading, setLoading] = useState<Loading>({
    isLoading: false,
  });
  const [skeletonProps, setSkeletonProps] = useState<any>({
    numRows: null,
    numCols: null,
    maxRowWidth: 100,
    minRowWidth: 75,
    rowWidth: null,
    rowHeight: 20,
    contentMargin: 28,
  });
  return (
    <LoadingContext.Provider value={[loading, setLoading, skeletonProps, setSkeletonProps]}>
      {props.children}
    </LoadingContext.Provider>
  );
};

export const LoadingContext = createContext<any>({
  isLoading: false,
});
