import { Coords } from "@models/coords";
import { createContext, useEffect, useState } from "react";

const defaultValue = {
  lat: null,
  long: null,
  loading: true,
  error: false,
};

export const CoordsProvider = (props: any): any => {
  const [coords, setCoords] = useState<Coords>(defaultValue);

  useEffect((): any => {
    let isSubscribed = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isSubscribed) {
          setCoords((coords: Coords) => {
            return {
              lat: position.coords.latitude,
              long: position.coords.longitude,
              loading: false,
              error: false,
            };
          });
        }
      },
      (error) => {
        setCoords((coords: Coords) => {
          return {
            ...coords,
            loading: false,
            error: true,
          };
        });
      }
    );
    return () => (isSubscribed = false);
  }, []);

  return (
    <CoordsContext.Provider value={[coords, setCoords]}>
      {props.children}
    </CoordsContext.Provider>
  );
};
export const CoordsContext = createContext<any>(defaultValue);
