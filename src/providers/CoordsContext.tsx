import { Coords } from "@models/coords";
import Api from '@utils/api';
import { createContext, useEffect, useState } from "react";

const defaultValue = {
  lat: null,
  lon: null,
  loading: true,
  error: false,
};

const api = new Api();

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
              lon: position.coords.longitude,
              loading: false,
              error: false,
            };
          });
        }
      },
      (error) => {
        api.getLocationByIP()
          .then((res) => {
            if (isSubscribed) {
              setCoords((coords: Coords) => {
                return {
                  lat: res.lat,
                  lon: res.lon,
                  loading: false,
                  error: false,
                  city: res.city
                };
              });
            }
          })
          .catch((err) => {
            if (isSubscribed) {
              setCoords((coords: Coords) => {
                return {
                  ...coords,
                  loading: false,
                  error: true,
                };
              });
            }
          })
      },
      { timeout: 4500 }
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
