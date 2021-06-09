import { ENDPOINTS } from "@enums/endpoints.enum";
import { HOME_MESSAGES } from "@enums/home.enum";
import { CurrentCityWeather } from "@models/current-weather";
import { SearchParams } from "@models/search-params";
import { SearchParamsContext } from "@providers/SearchParamsContext";
import { WeatherContext } from "@providers/WeatherContext";
import { buildSearchParams } from "@utils/helpers";
import { useContext, useEffect, useState } from "react";

const getData = (params: any): Promise<any> => {
  const query = buildSearchParams(params);
  return fetch(ENDPOINTS.MOCK_CITY + query, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export default function Home(props: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useContext(SearchParamsContext);
  const [weather, setWeather] = useContext(WeatherContext);

  useEffect((): any => {
    let isSubscribed = true;
    const exists = weather.find(
      (item: CurrentCityWeather) => item.name === searchParams.searchValue
    );
    if (searchParams.submitted && !loading && !exists) {
      setLoading(true);
      getData({ cityName: searchParams.searchValue, units: "imperial" })
        .then((response: any) => response.json())
        .then((response: CurrentCityWeather[]) => {
          if (isSubscribed) {
            setWeather((weather: CurrentCityWeather[]) => [
              ...weather,
              ...response,
            ]);
            setSearchParams({
              ...searchParams,
              searchValue: "",
              submitted: false,
            });
          }
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => (isSubscribed ? setLoading(false) : null));
    }

    return () => {
      isSubscribed = false;
    };
  }, [searchParams]);

  useEffect((): any => {
    let isSubscribed = true;
    navigator.geolocation.getCurrentPosition(function (position) {
      if (isSubscribed) {
        setSearchParams((searchParams: SearchParams) => {
          return {
            ...searchParams,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };
        });
      }
    });

    console.log("Latitude is:", searchParams.lat);
    console.log("Longitude is:", searchParams.long);
    return () => (isSubscribed = false);
  }, [searchParams.lat, searchParams.long]);

  return (
    <div className="home-page">
      <h1 className="home-page-title">{HOME_MESSAGES.TITLE}</h1>
      <div className="home-page-content">{props.children}</div>
    </div>
  );
}
