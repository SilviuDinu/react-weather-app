import { HOME_MESSAGES } from "@enums/home.enum";
import { CurrentCityWeather } from "@models/current-weather";
import Notification from "@components/Notification";
import { Notification as NotificationModel } from "@models/notification";
import { SearchParams } from "@models/search-params";
import { SearchParamsContext } from "@providers/SearchParamsContext";
import { WeatherContext } from "@providers/WeatherContext";
import { getLocationByCoords, getWeatherByCity } from "@utils/helpers";
import { useContext, useEffect, useState } from "react";

export default function Home(props: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationModel>();
  const [searchParams, setSearchParams] = useContext(SearchParamsContext);
  const [weather, setWeather] = useContext(WeatherContext);

  useEffect((): any => {
    let isSubscribed = true;
    const exists = weather.find(
      (item: CurrentCityWeather) => item.name === searchParams.searchValue
    );
    if (searchParams.submitted && !loading && !exists) {
      setLoading(true);
      getWeatherByCity({ cityName: searchParams.searchValue, units: "metric" })
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
        .catch((err: any) => {
          setNotification({
            type: "error",
            message: err.error,
            isVisible: true,
          });
        })
        .finally(() => (isSubscribed ? setLoading(false) : null));
    }

    return () => {
      isSubscribed = false;
    };
  }, [searchParams]);

  useEffect((): any => {
    let isSubscribed = true;
    const queryObj = { lat: searchParams.lat, long: searchParams.long };
    navigator.geolocation.getCurrentPosition(function (position) {
      if (isSubscribed) {
        setSearchParams((searchParams: SearchParams) => {
          return {
            ...searchParams,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };
        });
        getLocationByCoords(queryObj)
          .then((response: any) => response.json())
          .then((response: any) => {
            console.log(response);
          })
          .catch((err) => {
            setNotification({
              type: "error",
              message: err.error,
              isVisible: true,
            });
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
      <Notification
        isVisible={notification?.isVisible}
        type={notification?.type}
        message={notification?.message}
      />
      <div className="home-page-content">{props.children}</div>
    </div>
  );
}
