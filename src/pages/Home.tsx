import { HOME_MESSAGES } from "@enums/home.enum";
import { CurrentCityWeather } from "@models/current-weather";
import Notification from "@components/Notification";
import SearchForm from "@components/SearchForm";
import Loader from "@components/Loader";
import CardGroup from "@components/CardGroup";
import { Notification as NotificationModel } from "@models/notification";
import { SearchParamsContext } from "@providers/SearchParamsContext";
import { WeatherContext } from "@providers/WeatherContext";
import {
  getObjIndexFromArray,
  getWeatherByCity,
  getWeatherByCoords,
} from "@utils/helpers";
import { useContext, useEffect, useRef, useState } from "react";
import { FORM_DATA } from "@enums/search-form.enum";
import { CoordsContext } from "@providers/CoordsContext";
import { LoadingContext } from '@providers/LoadingContext';

const formData = {
  input: {
    placeholder: FORM_DATA.PLACEHOLDER,
    ariaLabel: FORM_DATA.ARIA_LABEL,
    class: "city-search-form-input",
    autoComplete: false,
  },
  buttonText: FORM_DATA.BUTTON_TEXT,
  class: "city-search-form",
};

export default function Home(props: any) {
  const isMounted = useRef(true);
  const [notification, setNotification] = useState<NotificationModel>();
  const [loading, setLoading] = useContext(LoadingContext);
  const [searchParams, setSearchParams] = useContext(SearchParamsContext);
  const [coords, setCoords] = useContext(CoordsContext);
  const [weather, setWeather] = useContext(WeatherContext);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      setLoading(coords.loading);
      if (!coords.loading) {
        getWeatherByCoords({ lat: coords.lat, long: coords.long })
          .then((response: any) => response.json())
          .then((response: CurrentCityWeather[]) => {
            if (isMounted.current) {
              updateWeather(response);
            }
          })
          .catch((err: any) => {
            if (isMounted.current) {
              setNotification({
                type: "error",
                message: err.error,
                isVisible: true,
              });
            }
          });
      }
    }
  }, [coords.loading]);

  useEffect(() => {
    if (isMounted.current && searchParams.submitted) {
      setLoading(true);
      getWeatherByCity({ cityName: searchParams.searchValue, units: "metric" })
        .then((response: any) => response.json())
        .then((response: CurrentCityWeather[]) => {
          if (isMounted.current) {
            updateWeather(response);
            setSearchParams({
              ...searchParams,
              searchValue: "",
              submitted: false,
            });
          }
        })
        .catch((err: any) => {
          if (isMounted.current) {
            setNotification({
              type: "error",
              message: err.error,
              isVisible: true,
            });
          }
        })
        .finally(() => (isMounted.current ? setLoading(false) : null));
    }
  }, [searchParams.submitted]);

  const updateWeather = (response: CurrentCityWeather[]): void => {
    const [item = {}] = response;
    const index = getObjIndexFromArray(weather, item);
    if (index > -1) {
      weather[index] = item;
      setWeather([...weather]);
    } else {
      setWeather((weather: CurrentCityWeather[]) => [...weather, ...response]);
    }
  };

  return (
    <div className="home-page">
      <h1 className="home-page-title">{HOME_MESSAGES.TITLE}</h1>
      <Notification
        isVisible={notification?.isVisible}
        type={notification?.type}
        message={notification?.message}
      />
      <div className="home-page-content">
        <SearchForm form={formData} />
        {/* try to display forecast based on current location */}
        {coords.loading && !coords.error ? (
          <Loader isLoading={coords.loading} />
        ) : (
          <CardGroup />
        )}
      </div>
    </div>
  );
}
