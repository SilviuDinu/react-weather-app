import { createContext, useState } from "react";

export const LoadingProvider = (props: any): any => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={[loading, setLoading]}>
      {props.children}
    </LoadingContext.Provider>
  );
};
export const LoadingContext = createContext<any>(false);
