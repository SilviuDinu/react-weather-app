import { SearchParams } from "@models/search-params";
import { createContext, useState } from "react";

const defaultValue = {
  searchValue: "",
  lat: null,
  long: null,
  submitted: false,
};

export const SearchParamsProvider = (props: any): any => {
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultValue);

  return (
    <SearchParamsContext.Provider value={[searchParams, setSearchParams]}>
      {props.children}
    </SearchParamsContext.Provider>
  );
};
export const SearchParamsContext = createContext<any>(defaultValue);
