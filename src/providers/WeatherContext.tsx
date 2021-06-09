import { CurrentCityWeather } from "@models/current-weather";
import { createContext, useState } from "react";

export const WeatherContext = createContext<any>([]);

export const WeatherProvider = (props: any): any => {
  const [weather, setWeather] = useState<CurrentCityWeather[]>([]);

  return (
    <WeatherContext.Provider
      value={[weather, setWeather]}
    >
      {props.children}
    </WeatherContext.Provider>
  );
};
